export interface StudentStats {
  academic: number;
  physical: number;
  adaptability: number;
  socialContribution: number;
}

export interface Student {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  class: 'A' | 'B' | 'C' | 'D';
  imageUrl: string;
  stats: StudentStats;
  overallScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';
}

export const calculateOverallScore = (stats: StudentStats): number => {
  const { academic, physical, adaptability, socialContribution } = stats;
  return Math.round((academic + physical + adaptability + socialContribution) / 4);
};

export const calculateGrade = (score: number): Student['grade'] => {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 78) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C+';
  if (score >= 50) return 'C';
  return 'D';
};

const createStudent = (
  id: string,
  firstName: string,
  lastName: string,
  studentClass: Student['class'],
  stats: StudentStats
): Student => {
  const overallScore = calculateOverallScore(stats);
  return {
    id,
    name: `${lastName} ${firstName}`,
    firstName,
    lastName,
    class: studentClass,
    imageUrl: `/avatars/${id}.png`,
    stats,
    overallScore,
    grade: calculateGrade(overallScore),
  };
};

export const students: Student[] = [
  // Class D Students
  createStudent('ayanokouji-kiyotaka', 'Kiyotaka', 'Ayanokouji', 'D', {
    academic: 50,
    physical: 50,
    adaptability: 100,
    socialContribution: 51,
  }),
  createStudent('horikita-suzune', 'Suzune', 'Horikita', 'D', {
    academic: 87,
    physical: 68,
    adaptability: 55,
    socialContribution: 38,
  }),
  createStudent('kushida-kikyo', 'Kikyo', 'Kushida', 'D', {
    academic: 72,
    physical: 52,
    adaptability: 78,
    socialContribution: 95,
  }),
  createStudent('sudo-ken', 'Ken', 'Sudo', 'D', {
    academic: 32,
    physical: 96,
    adaptability: 48,
    socialContribution: 25,
  }),
  createStudent('hirata-yosuke', 'Yosuke', 'Hirata', 'D', {
    academic: 75,
    physical: 70,
    adaptability: 82,
    socialContribution: 92,
  }),
  createStudent('karuizawa-kei', 'Kei', 'Karuizawa', 'D', {
    academic: 58,
    physical: 42,
    adaptability: 85,
    socialContribution: 88,
  }),
  createStudent('kouenji-rokusuke', 'Rokusuke', 'Kouenji', 'D', {
    academic: 90,
    physical: 98,
    adaptability: 60,
    socialContribution: 15,
  }),
  createStudent('sakura-airi', 'Airi', 'Sakura', 'D', {
    academic: 55,
    physical: 38,
    adaptability: 40,
    socialContribution: 35,
  }),

  // Class A Students
  createStudent('sakayanagi-arisu', 'Arisu', 'Sakayanagi', 'A', {
    academic: 96,
    physical: 22,
    adaptability: 92,
    socialContribution: 85,
  }),
  createStudent('katsuragi-kohei', 'Kohei', 'Katsuragi', 'A', {
    academic: 84,
    physical: 75,
    adaptability: 72,
    socialContribution: 68,
  }),
  createStudent('hashimoto-masayoshi', 'Masayoshi', 'Hashimoto', 'A', {
    academic: 78,
    physical: 68,
    adaptability: 88,
    socialContribution: 72,
  }),
  createStudent('kamuro-masumi', 'Masumi', 'Kamuro', 'A', {
    academic: 76,
    physical: 55,
    adaptability: 82,
    socialContribution: 60,
  }),

  // Class B Students
  createStudent('ichinose-honami', 'Honami', 'Ichinose', 'B', {
    academic: 88,
    physical: 62,
    adaptability: 86,
    socialContribution: 98,
  }),
  createStudent('kanzaki-ryuji', 'Ryuji', 'Kanzaki', 'B', {
    academic: 82,
    physical: 72,
    adaptability: 76,
    socialContribution: 78,
  }),
  createStudent('shibata-sou', 'Sou', 'Shibata', 'B', {
    academic: 65,
    physical: 88,
    adaptability: 70,
    socialContribution: 82,
  }),

  // Class C Students
  createStudent('ryuen-kakeru', 'Kakeru', 'Ryuen', 'C', {
    academic: 72,
    physical: 86,
    adaptability: 95,
    socialContribution: 45,
  }),
  createStudent('ibuki-mio', 'Mio', 'Ibuki', 'C', {
    academic: 62,
    physical: 92,
    adaptability: 72,
    socialContribution: 38,
  }),
  createStudent('ishizaki-daichi', 'Daichi', 'Ishizaki', 'C', {
    academic: 42,
    physical: 78,
    adaptability: 55,
    socialContribution: 52,
  }),
  createStudent('albert-yamada', 'Yamada', 'Albert', 'C', {
    academic: 38,
    physical: 95,
    adaptability: 45,
    socialContribution: 40,
  }),
  createStudent('hiyori-shiina', 'Hiyori', 'Shiina', 'C', {
    academic: 85,
    physical: 35,
    adaptability: 78,
    socialContribution: 72,
  }),
];

export type SortKey = 'overallScore' | 'academic' | 'physical' | 'adaptability' | 'socialContribution';
export type ClassFilter = 'All' | 'A' | 'B' | 'C' | 'D';

export const sortStudents = (studentList: Student[], sortKey: SortKey): Student[] => {
  return [...studentList].sort((a, b) => {
    if (sortKey === 'overallScore') {
      return b.overallScore - a.overallScore;
    }
    return b.stats[sortKey] - a.stats[sortKey];
  });
};

export const filterByClass = (studentList: Student[], classFilter: ClassFilter): Student[] => {
  if (classFilter === 'All') return studentList;
  return studentList.filter(student => student.class === classFilter);
};

export const searchStudents = (studentList: Student[], query: string): Student[] => {
  const lowerQuery = query.toLowerCase();
  return studentList.filter(
    student =>
      student.name.toLowerCase().includes(lowerQuery) ||
      student.firstName.toLowerCase().includes(lowerQuery) ||
      student.lastName.toLowerCase().includes(lowerQuery)
  );
};
