export interface PrototypeConcept {
  title: string;
  tagline: string;
  targetAudience: string;
  problemSolved: string;
  coreFeatures: string[];
  suggestedScreens: {
    name: string;
    description: string;
  }[];
}
