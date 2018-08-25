import { ChipCode } from '../../../../scripts/chip';
import * as React from 'react';
import { ChipDisplay } from '../../../components/chip-display';
import { Images } from '../../../../defs/images';
import { ChipRenderer } from '../../../components/chip-select/main';

import * as styles from '../../css/screen/custom-parts-screen.css';
import { CustomPartsData } from '../../../../defs/map';

export interface IPropChipInformation {
  images: Images;
  customParts: CustomPartsData;
  currentChipCode: ChipCode | null;
  onDrawChip: ChipRenderer<ChipCode>;
}
/**
 * Show information of currently selected chip.
 */
export function ChipInformation({
  images,
  customParts,
  currentChipCode,
  onDrawChip,
}: IPropChipInformation) {
  if (currentChipCode == null) {
    return null;
  }
  const chipDef = customParts[currentChipCode];
  if (chipDef == null) {
    return null;
  }
  return (
    <div className={styles.chipInformation}>
      <div className={styles.chipDisplay}>
        <ChipDisplay
          chipId={currentChipCode}
          images={images}
          onDrawChip={onDrawChip}
        />
      </div>
      <div className={styles.chipDescription}>
        <p>{chipDef.name}</p>
      </div>
    </div>
  );
}