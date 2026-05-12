// Shared singleton: tracks whether the user has triggered audio interaction.
// AudioPlayer marks it true on first play; other components read it before playing sounds.
let interacted = false;
export const markInteracted = () => { interacted = true; };
export const hasInteracted = () => interacted;
