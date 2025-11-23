import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      isAdmin: true,
    },
  });
  console.log('✅ Created admin user');

  // Create sample users
  const user1Password = await bcrypt.hash('password123', 10);
  const user1 = await prisma.user.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'student1@example.com',
      passwordHash: user1Password,
    },
  });

  const user2Password = await bcrypt.hash('password123', 10);
  const user2 = await prisma.user.upsert({
    where: { email: 'student2@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'student2@example.com',
      passwordHash: user2Password,
    },
  });
  console.log('✅ Created sample users');

  // Create sample sources
  const source1 = await prisma.source.upsert({
    where: { id: 'source-1' },
    update: {},
    create: {
      id: 'source-1',
      name: 'JEE Main Official',
      url: 'https://jeemain.nta.ac.in/rss',
      sourceType: 'RSS',
      trustLevel: 9,
      pollIntervalMinutes: 60,
      active: true,
    },
  });

  const source2 = await prisma.source.upsert({
    where: { id: 'source-2' },
    update: {},
    create: {
      id: 'source-2',
      name: 'NEET Official',
      url: 'https://neet.nta.nic.in/rss',
      sourceType: 'RSS',
      trustLevel: 9,
      pollIntervalMinutes: 60,
      active: true,
    },
  });

  const source3 = await prisma.source.upsert({
    where: { id: 'source-3' },
    update: {},
    create: {
      id: 'source-3',
      name: 'UP Board Results',
      url: 'https://upresults.nic.in',
      sourceType: 'HTML',
      trustLevel: 8,
      pollIntervalMinutes: 120,
      active: true,
    },
  });

  const source4 = await prisma.source.upsert({
    where: { id: 'source-4' },
    update: {},
    create: {
      id: 'source-4',
      name: 'Scholarship Portal',
      url: 'https://scholarships.gov.in/api/notifications',
      sourceType: 'API',
      trustLevel: 7,
      pollIntervalMinutes: 180,
      active: true,
    },
  });

  const source5 = await prisma.source.upsert({
    where: { id: 'source-5' },
    update: {},
    create: {
      id: 'source-5',
      name: 'CBSE Notifications',
      url: 'https://cbse.gov.in/rss',
      sourceType: 'RSS',
      trustLevel: 9,
      pollIntervalMinutes: 60,
      active: true,
    },
  });
  console.log('✅ Created sample sources');

  // Create sample items
  const item1 = await prisma.item.create({
    data: {
      title: 'JEE Main 2024 Registration Open',
      body: 'The National Testing Agency (NTA) has announced the opening of registration for JEE Main 2024. Students can register online at jeemain.nta.ac.in. The last date for registration is December 15, 2023. The examination will be conducted in multiple sessions starting from January 2024.',
      publishedAt: new Date('2023-11-01'),
      url: 'https://jeemain.nta.ac.in/notification-1',
      sourceId: source1.id,
      type: 'EXAM',
      tags: ['JEE', 'Engineering', 'Entrance Exam'],
      shortSummary: 'JEE Main 2024 registration opens. Last date: December 15, 2023.',
      longSummary: 'The National Testing Agency has opened registration for JEE Main 2024. Students can apply online until December 15, 2023. The exam will be conducted in multiple sessions starting January 2024.',
      dedupeHash: 'hash1',
      extractedEntities: {
        examName: 'JEE Main',
        institution: 'NTA',
        lastDate: '2023-12-15',
        startDate: '2024-01-01',
      },
    },
  });

  const item2 = await prisma.item.create({
    data: {
      title: 'NEET 2024 Application Form Released',
      body: 'The NEET 2024 application form is now available on the official website. Candidates must complete the registration process before the deadline. The examination date will be announced soon.',
      publishedAt: new Date('2023-11-05'),
      url: 'https://neet.nta.nic.in/notification-1',
      sourceId: source2.id,
      type: 'EXAM',
      tags: ['NEET', 'Medical', 'Entrance Exam'],
      shortSummary: 'NEET 2024 application form released. Registration deadline approaching.',
      longSummary: 'The NEET 2024 application form has been released on the official website. Candidates are advised to complete their registration before the deadline. The examination date will be announced in due course.',
      dedupeHash: 'hash2',
      extractedEntities: {
        examName: 'NEET',
        institution: 'NTA',
      },
    },
  });

  const item3 = await prisma.item.create({
    data: {
      title: 'UP Board Class 12 Results 2023 Declared',
      body: 'The Uttar Pradesh Board has declared the Class 12 results for the year 2023. Students can check their results on the official website upresults.nic.in using their roll number and date of birth.',
      publishedAt: new Date('2023-11-10'),
      url: 'https://upresults.nic.in/results-2023',
      sourceId: source3.id,
      type: 'RESULT',
      tags: ['UP Board', 'Class 12', 'Results'],
      shortSummary: 'UP Board Class 12 results 2023 declared. Check online with roll number.',
      longSummary: 'The Uttar Pradesh Board has officially declared the Class 12 results for 2023. Students can access their results on the official website using their roll number and date of birth.',
      dedupeHash: 'hash3',
      extractedEntities: {
        institution: 'UP Board',
      },
    },
  });

  const item4 = await prisma.item.create({
    data: {
      title: 'Merit-Based Scholarship for Engineering Students',
      body: 'Applications are invited for merit-based scholarships for engineering students. Eligible candidates must have secured at least 80% marks in their previous examination. The scholarship amount is Rs. 50,000 per year. Last date to apply: November 30, 2023.',
      publishedAt: new Date('2023-11-08'),
      url: 'https://scholarships.gov.in/engineering-merit',
      sourceId: source4.id,
      type: 'SCHOLARSHIP',
      tags: ['Scholarship', 'Engineering', 'Merit-Based'],
      shortSummary: 'Merit-based engineering scholarship. Rs. 50,000/year. Apply by Nov 30, 2023.',
      longSummary: 'Merit-based scholarships are available for engineering students who have secured at least 80% marks. The scholarship provides Rs. 50,000 per year. Applications must be submitted by November 30, 2023.',
      dedupeHash: 'hash4',
      extractedEntities: {
        institution: 'Scholarship Portal',
        lastDate: '2023-11-30',
      },
    },
  });

  const item5 = await prisma.item.create({
    data: {
      title: 'CBSE Class 10 Board Exam Dates Announced',
      body: 'The Central Board of Secondary Education has announced the dates for Class 10 board examinations. The exams will commence from February 15, 2024. Detailed timetable will be released soon.',
      publishedAt: new Date('2023-11-12'),
      url: 'https://cbse.gov.in/class10-dates',
      sourceId: source5.id,
      type: 'EXAM',
      tags: ['CBSE', 'Class 10', 'Board Exam'],
      shortSummary: 'CBSE Class 10 board exams start February 15, 2024. Timetable coming soon.',
      longSummary: 'The CBSE has announced that Class 10 board examinations will begin on February 15, 2024. The detailed timetable will be published on the official website in the coming weeks.',
      dedupeHash: 'hash5',
      extractedEntities: {
        examName: 'CBSE Class 10',
        institution: 'CBSE',
        startDate: '2024-02-15',
      },
    },
  });
  console.log('✅ Created sample items');

  // Create alert rules
  await prisma.alertRule.create({
    data: {
      userId: user1.id,
      name: 'JEE Notifications',
      keywordsJson: ['JEE', 'Joint Entrance'],
      examNamesJson: ['JEE Main', 'JEE Advanced'],
      typesJson: ['EXAM', 'SCHOLARSHIP'],
      locationsJson: ['Uttar Pradesh'],
      minTrustLevel: 7,
      frequency: 'immediate',
      active: true,
    },
  });

  await prisma.alertRule.create({
    data: {
      userId: user1.id,
      name: 'BTech Scholarships',
      keywordsJson: ['scholarship', 'engineering'],
      examNamesJson: [],
      typesJson: ['SCHOLARSHIP'],
      locationsJson: [],
      minTrustLevel: 5,
      frequency: 'immediate',
      active: true,
    },
  });

  await prisma.alertRule.create({
    data: {
      userId: user2.id,
      name: 'UP Board Results',
      keywordsJson: ['UP Board', 'result'],
      examNamesJson: [],
      typesJson: ['RESULT'],
      locationsJson: ['Uttar Pradesh'],
      minTrustLevel: 6,
      frequency: 'immediate',
      active: true,
    },
  });

  await prisma.alertRule.create({
    data: {
      userId: user2.id,
      name: 'Medical Entrance',
      keywordsJson: ['NEET', 'medical'],
      examNamesJson: ['NEET'],
      typesJson: ['EXAM'],
      locationsJson: [],
      minTrustLevel: 8,
      frequency: 'immediate',
      active: true,
    },
  });
  console.log('✅ Created alert rules');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

