import {
  ImgComparisonSlider,
} from "@img-comparison-slider/react";
import { getImageUrl } from "../lib/api";

interface Props {
  repoPath: string;
  file: string;
  commitA: string;
  commitB: string;
}

export function SliderCompare({ repoPath, file, commitA, commitB }: Props) {
  return (
    <ImgComparisonSlider className="w-full">
      <img
        slot="first"
        src={getImageUrl(repoPath, commitA, file)}
        alt={`${commitA.substring(0, 7)}`}
        className="w-full"
      />
      <img
        slot="second"
        src={getImageUrl(repoPath, commitB, file)}
        alt={`${commitB.substring(0, 7)}`}
        className="w-full"
      />
    </ImgComparisonSlider>
  );
}
