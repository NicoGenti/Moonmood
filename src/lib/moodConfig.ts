export interface MoodLevel {
  emoji: string;
  label: string;
  color: string;
}

export function getMoodLevel(score: number): MoodLevel {
  if (score <= 1) return { emoji: "😞", label: "Molto giù", color: "#6c7a89" };
  if (score <= 3) return { emoji: "😔", label: "Non benissimo", color: "#4682b4" };
  if (score <= 5) return { emoji: "😐", label: "Così così", color: "#7c8fa0" };
  if (score <= 7) return { emoji: "🙂", label: "Abbastanza bene", color: "#5ba3d9" };
  if (score <= 9) return { emoji: "😊", label: "Bene", color: "#8b5cf6" };
  return { emoji: "🤩", label: "Alla grande!", color: "#ec4899" };
}

export type TimeOfDay = "mattina" | "pomeriggio" | "sera" | "notte";

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "mattina";
  if (hour >= 12 && hour < 18) return "pomeriggio";
  if (hour >= 18 && hour < 23) return "sera";
  return "notte";
}

export function getGreeting(): string {
  const time = getTimeOfDay();
  switch (time) {
    case "mattina":
      return "Buongiorno 🌅";
    case "pomeriggio":
      return "Buon pomeriggio ☀️";
    case "sera":
      return "Buonasera 🌙";
    case "notte":
      return "Buonanotte 🌌";
  }
}

export function getMoodQuestion(): string {
  const time = getTimeOfDay();
  switch (time) {
    case "mattina":
      return "Come ti senti stamattina?";
    case "pomeriggio":
      return "Come va il pomeriggio?";
    case "sera":
      return "Come è andata oggi?";
    case "notte":
      return "Come stai stasera?";
  }
}

export function getSaveMessage(score: number): string {
  if (score >= 7) return "Che bella giornata! 🌟";
  if (score >= 5) return "Grazie per aver condiviso 😊";
  if (score >= 3) return "Ci sono anche i giorni grigi 💙";
  return "Grazie per aver condiviso 💜";
}

export function getEncouragingMessage(): string {
  const time = getTimeOfDay();
  switch (time) {
    case "mattina":
      return "Buona giornata! ☀️";
    case "pomeriggio":
      return "Il pomeriggio è ancora lungo 🙌";
    case "sera":
      return "Buona serata! 🌙";
    case "notte":
      return "Ci vediamo domani 🌌";
  }
}

export function getNotePlaceholder(): string {
  const time = getTimeOfDay();
  switch (time) {
    case "mattina":
      return "Come inizia la tua giornata?";
    case "pomeriggio":
      return "Cosa stai pensando adesso?";
    case "sera":
      return "Com'è andata oggi?";
    case "notte":
      return "Pensieri prima di dormire...";
  }
}
