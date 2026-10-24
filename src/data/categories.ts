export interface CategoryInfo {
  slug: string;
  label: string;
  description: string;
  icon: string;
  /** tone untuk Pill/IconBadge */
  tone: 'violet' | 'pink' | 'mint' | 'amber' | 'sky' | 'lime' | 'orange' | 'magenta';
  /** gradient background untuk kartu penuh warna */
  bg: string;
  /** soft background
   * dipakai di hero/section */
  soft: string;
}

export const CATEGORIES: Record<string, CategoryInfo> = {
  web: {
    slug: 'web',
    label: 'Pengembangan Web',
    description: 'Membangun aplikasi web modern: HTML, CSS, JavaScript, sampai Laravel dan backend.',
    icon: 'bx-globe',
    tone: 'sky',
    bg: 'bg-gradient-to-br from-[#38B6F7] to-[#7CD4FF]',
    soft: 'bg-sky-soft'
  },
  mobile: {
    slug: 'mobile',
    label: 'Pengembangan Mobile',
    description: 'Membuat aplikasi native & cross-platform dengan Dart dan Flutter, dari widget dasar sampai lanjutan.',
    icon: 'bx-mobile-alt',
    tone: 'violet',
    bg: 'bg-gradient-to-br from-violet to-[#9B7BFF]',
    soft: 'bg-violet-soft'
  },
  'ui-ux': {
    slug: 'ui-ux',
    label: 'Desain UI/UX',
    description: 'Menguasai layout, teori warna, tipografi, dan riset pengguna untuk merancang antarmuka yang menawan.',
    icon: 'bx-paint',
    tone: 'pink',
    bg: 'bg-gradient-to-br from-[#FF5C9A] to-[#FF8FB8]',
    soft: 'bg-pink-soft'
  },
  qa: {
    slug: 'qa',
    label: 'Jaminan Mutu',
    description: 'Menjamin keandalan software lewat pengujian manual, otomatisasi, dan manajemen bug yang terstruktur.',
    icon: 'bx-bug',
    tone: 'amber',
    bg: 'bg-gradient-to-br from-[#FFB020] to-[#FFD36B]',
    soft: 'bg-amber-soft'
  },
  devops: {
    slug: 'devops',
    label: 'DevOps',
    description: 'Efisienkan siklus pengembangan dengan CI/CD, cloud, dan kontainerisasi.',
    icon: 'bx-cloud',
    tone: 'mint',
    bg: 'bg-gradient-to-br from-[#12C9A0] to-[#5EE3C2]',
    soft: 'bg-mint-soft'
  },
  iot: {
    slug: 'iot',
    label: 'Internet of Things',
    description: 'Membangun perangkat terhubung dengan Raspberry Pi, message broker, dan arsitektur event-driven.',
    icon: 'bx-chip',
    tone: 'lime',
    bg: 'bg-gradient-to-br from-[#84CC16] to-[#A3E635]',
    soft: 'bg-lime-soft'
  },
  game: {
    slug: 'game',
    label: 'Pengembangan Game',
    description: 'Merancang dan memprogram pengalaman interaktif dengan game engine modern.',
    icon: 'bx-game',
    tone: 'magenta',
    bg: 'bg-gradient-to-br from-[#D946EF] to-[#EC8FF9]',
    soft: 'bg-magenta-soft'
  },
  tools: {
    slug: 'tools',
    label: 'Perkakas',
    description: 'Menguasai tools wajib developer: Git, GitHub, dan version control untuk kerja tim yang efisien.',
    icon: 'bx-wrench',
    tone: 'orange',
    bg: 'bg-gradient-to-br from-[#FF8A3D] to-[#FFB37A]',
    soft: 'bg-orange-soft'
  }
};

export const DIFFICULTY_TONE: Record<string, 'mint' | 'amber' | 'pink'> = {
  Beginner: 'mint',
  Intermediate: 'amber',
  Advanced: 'pink'
};

export const DIFFICULTY_LABEL: Record<string, string> = {
  Beginner: 'Pemula',
  Intermediate: 'Menengah',
  Advanced: 'Lanjutan'
};

const UNKNOWN_CATEGORY = CATEGORIES.web;
export function categoryOf(slug: string | undefined): CategoryInfo {
  return (slug && CATEGORIES[slug]) || UNKNOWN_CATEGORY;
}
