import {
  Award,
  Boxes,
  Headset,
  Handshake,
  ShieldCheck,
  Wrench,
  Factory,
  Truck,
  Settings,
  Users,
  Star,
  CheckCircle2,
  Zap,
  Package,
  Globe,
} from "lucide-react";

export const ICON_MAP = {
  Award,
  Boxes,
  Headset,
  Handshake,
  ShieldCheck,
  Wrench,
  Factory,
  Truck,
  Settings,
  Users,
  Star,
  CheckCircle2,
  Zap,
  Package,
  Globe,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export function resolveIcon(name) {
  return ICON_MAP[name] || ShieldCheck;
}
