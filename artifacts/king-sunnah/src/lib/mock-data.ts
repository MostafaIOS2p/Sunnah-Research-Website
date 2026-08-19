export type Hadith = {
  id: string;
  bookId: string;
  bookName: string;
  chapter: string;
  number: number;
  textAr: string;
  grade: 'صحيح' | 'حسن' | 'ضعيف' | 'موضوع';
  narratorsChain: string[];
  explanation?: string;
};

export type Narrator = {
  id: string;
  name: string;
  generation: string;
  reliability: string;
  bio: string;
  hadithCount: number;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  hadithCount: number;
  description: string;
};

export const MOCK_BOOKS: Book[] = [
  { id: 'b1', title: 'صحيح البخاري', author: 'محمد بن إسماعيل البخاري', hadithCount: 7275, description: 'الجامع المسند الصحيح المختصر من أمور رسول الله صلى الله عليه وسلم وسننه وأيامه' },
  { id: 'b2', title: 'صحيح مسلم', author: 'مسلم بن الحجاج', hadithCount: 3033, description: 'المسند الصحيح المختصر بنقل العدل عن العدل إلى رسول الله صلى الله عليه وسلم' },
  { id: 'b3', title: 'سنن أبي داود', author: 'أبو داود السجستاني', hadithCount: 5274, description: 'من أهم كتب الحديث ومصنفاته' },
  { id: 'b4', title: 'جامع الترمذي', author: 'أبو عيسى محمد الترمذي', hadithCount: 3956, description: 'الجامع المختصر من السنن عن رسول الله' },
];

export const MOCK_NARRATORS: Narrator[] = [
  { id: 'n1', name: 'أبو هريرة', generation: 'الصحابة', reliability: 'صحابي جليل', bio: 'عبد الرحمن بن صخر الدوسي، أكثر الصحابة رواية للحديث.', hadithCount: 5374 },
  { id: 'n2', name: 'عائشة بنت أبي بكر', generation: 'الصحابة', reliability: 'صحابية جليلة', bio: 'أم المؤمنين، فقيهة وعالمة، روت الكثير من الأحاديث.', hadithCount: 2210 },
  { id: 'n3', name: 'نافع مولى ابن عمر', generation: 'التابعين', reliability: 'ثقة ثبت', bio: 'أبو عبد الله المدني، من أئمة التابعين.', hadithCount: 1500 },
  { id: 'n4', name: 'مالك بن أنس', generation: 'أتباع التابعين', reliability: 'إمام حافظ', bio: 'إمام دار الهجرة، وصاحب الموطأ.', hadithCount: 2000 },
];

export const MOCK_HADITHS: Hadith[] = [
  {
    id: 'h1',
    bookId: 'b1',
    bookName: 'صحيح البخاري',
    chapter: 'كتاب بدء الوحي',
    number: 1,
    textAr: 'سمعت رسول الله صلى الله عليه وسلم يقول: إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى، فمن كانت هجرته إلى دنيا يصيبها، أو إلى امرأة ينكحها، فهجرته إلى ما هاجر إليه.',
    grade: 'صحيح',
    narratorsChain: ['n4', 'n3', 'n1'],
    explanation: 'هذا الحديث أصل من أصول الدين، وفيه بيان أن النية شرط لصحة الأعمال.'
  },
  {
    id: 'h2',
    bookId: 'b2',
    bookName: 'صحيح مسلم',
    chapter: 'كتاب الإيمان',
    number: 8,
    textAr: 'بني الإسلام على خمس: شهادة أن لا إله إلا الله وأن محمدا رسول الله، وإقام الصلاة، وإيتاء الزكاة، والحج، وصوم رمضان.',
    grade: 'صحيح',
    narratorsChain: ['n3', 'n2'],
    explanation: 'بيان لأركان الإسلام العظيمة التي لا يصح إسلام العبد إلا بها.'
  },
  {
    id: 'h3',
    bookId: 'b4',
    bookName: 'جامع الترمذي',
    chapter: 'كتاب البر والصلة',
    number: 1954,
    textAr: 'الكلمة الطيبة صدقة.',
    grade: 'حسن',
    narratorsChain: ['n1'],
    explanation: 'حث على طيب الكلام وحسن الخلق مع الناس.'
  }
];

export const searchHadiths = (query: string) => {
  if (!query) return MOCK_HADITHS;
  return MOCK_HADITHS.filter(h => 
    h.textAr.includes(query) || 
    h.bookName.includes(query) ||
    h.chapter.includes(query)
  );
};

export const getHadithById = (id: string) => MOCK_HADITHS.find(h => h.id === id);
export const getNarratorById = (id: string) => MOCK_NARRATORS.find(n => n.id === id);
export const getBookById = (id: string) => MOCK_BOOKS.find(b => b.id === id);
