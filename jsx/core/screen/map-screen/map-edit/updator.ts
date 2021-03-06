'use strict';

import { Rect } from '../../../../../scripts/rect';
import { sortedUniq } from '../../../../../scripts/util';

export interface Point {
  x: number;
  y: number;
}

export interface TileDep {
  x: number;
  y: number;
  big: boolean;
}
export interface DependencyTile {
  from: Array<TileDep>;
  to: Array<TileDep>;
}
/**
 * マップの各タイルの依存関係を解決するクラス
 */
export class TileDependency {
  private map!: Array<Array<DependencyTile>>;
  /**
   * @constructor
   * @param {number} width マップの横幅
   * @param {number} height マップの縦幅
   */
  constructor(private width: number, private height: number) {
    this.initMap();
  }

  /**
   * 依存関係マップを初期化
   */
  initMap(): void {
    const { width, height } = this;
    const result: Array<Array<DependencyTile>> = [];
    for (let y = 0; y < height; y++) {
      const row: Array<DependencyTile> = [];
      result.push(row);
      for (let x = 0; x < width; x++) {
        row.push({
          from: [],
          to: [],
        });
      }
    }
    this.map = result;
  }

  /**
   * サイズ変更
   * @param {number} width 横幅
   * @param {number} height 縦幅
   */
  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  /**
   * 指定した位置のタイルが影響を与える範囲を返す
   */
  toRegion(...points: Array<Point>): Array<TileDep> {
    const { map } = this;
    const result = [];
    for (let { x, y } of points) {
      result.push(...map[y][x].to);
    }
    return result;
  }
  /**
   * 指定した位置のタイルに影響を与える範囲を返す
   */
  fromRegion(...points: Array<Point>): Array<TileDep> {
    const { map } = this;
    const result = [];
    for (let { x, y } of points) {
      result.push(...map[y][x].from);
    }
    return result;
  }

  /**
   * 指定した位置のタイルを更新する
   *
   * @param {number} x タイルX座標
   * @param {number} y タイルY座標
   * @param {Rect} pollution 影響範囲
   * @param {number} pollution.minX 左上
   * @param {number} pollution.minY 左上
   * @param {number} pollution.maxX 右下
   * @param {number} pollution.maxY 右下
   */
  update(x: number, y: number, pollution: Rect) {
    const { map, width, height } = this;

    // 対象位置
    const target = map[y][x];

    // bigフラグ
    const big =
      pollution.minX !== 0 ||
      pollution.minY !== 0 ||
      pollution.maxX !== 1 ||
      pollution.maxY !== 1;

    // 自分の影響を除く
    for (let { x: dx, y: dy } of target.to) {
      const { from } = map[dy][dx];
      const l = from.length;

      for (let i = 0; i < l; i++) {
        if (from[i].x === x && from[i].y === y) {
          from.splice(i, 1);
          // 同じのは1つしかないと仮定
          break;
        }
      }
    }

    // 新しい影響範囲を計算
    target.to = [];
    const pw = pollution.maxX - pollution.minX;
    const ph = pollution.maxY - pollution.minY;
    for (let dx = 0; dx < pw; dx++) {
      for (let dy = 0; dy < ph; dy++) {
        const cx = x + pollution.minX + dx;
        const cy = y + pollution.minY + dy;

        if (cx < 0 || cy < 0 || cx >= width || cy >= height) {
          continue;
        }
        const t = map[cy][cx];
        if (t.from.every(({ x: x2, y: y2 }) => x !== x2 || y != y2)) {
          t.from.push({
            x,
            y,
            big,
          });
        }
        if (target.to.every(({ x, y }) => x !== cx || y !== cy)) {
          target.to.push({
            x: cx,
            y: cy,
            big,
          });
        }
      }
    }
  }
}

/**
 * マップの変更をdependencyに入力するクラス
 * C: チップの値の型
 */
export default class MapUpdator<C> {
  private pollutionCache: Map<C, Rect>;
  private deps: TileDependency;
  constructor(
    private width: number,
    private height: number,
    private pollutionCallback: (chip: C) => Rect,
  ) {
    this.pollutionCache = new Map();

    this.deps = new TileDependency(width, height);
  }

  /**
   * FIXME
   */
  fromRegion(...points: Array<Point>): Array<TileDep> {
    return this.deps.fromRegion(...points);
  }

  /**
   * マップの変更を登録して影響範囲を返す
   *
   * @param {number} x 変更開始X座標
   * @param {number} y 変更開始Y座標
   * @param {number} width 変更領域X大きさ
   * @param {number} height 変更領域y大きさ
   * @param {C[][]} map マップ
   *
   */
  update(
    x: number,
    y: number,
    width: number,
    height: number,
    map: Array<Array<C>>,
  ): Array<Point> {
    const { pollutionCallback, pollutionCache, deps } = this;
    // update範囲
    const upoints = [];
    const polls = [];
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const chip = map[y + j][x + i];
        // chipのpollution範囲を計算
        let pollution = pollutionCache.get(chip);
        if (pollution == null) {
          pollution = pollutionCallback(chip);
          pollutionCache.set(chip, pollution);
        }

        upoints.push({
          x: x + i,
          y: y + j,
        });
        polls.push(pollution);
      }
    }

    // 変更前の影響範囲
    const oldPoints = deps.toRegion(...upoints);

    // 変更
    for (let i = 0, l = upoints.length; i < l; i++) {
      const { x, y } = upoints[i];
      deps.update(x, y, polls[i]);
    }

    // 変更後の影響範囲
    const newPoints = deps.toRegion(...upoints);

    // uniq
    const points1 = [...oldPoints, ...newPoints].sort(
      ({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
        (x1 - x2) * this.height + (y1 - y2),
    );
    const points = sortedUniq(
      points1,
      ({ x: x1, y: y1 }, { x: x2, y: y2 }) => x1 === x2 && y1 === y2,
    );
    return points;
  }

  /**
   * マップのサイズを変更
   * @param {number} width 横幅
   * @param {number} height 縦幅
   */
  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.deps.resize(width, height);
  }

  /**
   * マップが全部変わったのを登録
   */
  resetMap(map: Array<Array<C>>): void {
    const { width, height, deps } = this;

    deps.initMap();
    this.update(0, 0, width, height, map);
  }
}
