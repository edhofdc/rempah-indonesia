import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@rempah.com' },
    update: {},
    create: { username: 'admin', email: 'admin@rempah.com', password: adminPassword, name: 'Admin Rempah Indonesia', role: 'admin' },
  })
  console.log('  ✅ Admin user created')

  // 2. Company Profile
  await prisma.companyProfile.upsert({
    where: { id: 'main' },
    update: {},
    create: { companyName: 'Rempah Indonesia', tagline: 'Authentic Indonesian Spices', description: 'Rempah Indonesia adalah perusahaan rempah-rempah terkemuka yang menyediakan rempah asli berkualitas tinggi dari berbagai daerah di Indonesia.', vision: 'Menjadi pemimpin global dalam penyediaan rempah-rempah Indonesia berkualitas premium.', mission: '1. Menyediakan rempah asli berkualitas tinggi\\n2. Memberdayakan petani rempah lokal\\n3. Melestarikan warisan rempah Nusantara\\n4. Memberikan edukasi tentang rempah Indonesia', address: 'Jl. Rempah Nusantara No. 123, Jakarta', phone: '(021) 1234-5678', email: 'info@rempahindonesia.com', whatsapp: '6281234567890' },
  })
  console.log('  ✅ Company profile created')

  // 3. Categories
  const categories = ['Rempah Utuh', 'Rempah Bubuk', 'Minyak Atsiri', 'Bumbu Jadi', 'Herbal']
  const catRecords: Record<string, string> = {}
  for (const name of categories) {
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    const cat = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug, description: `Kategori ${name}` },
    })
    catRecords[name] = cat.id
  }
  console.log(`  ✅ ${categories.length} categories created`)

  // 4. Products
  const products = [
    { name: 'Lada Putih Muntok', price: 85000, stock: 200, category: 'Rempah Utuh', weight: '100g', origin: 'Bangka Belitung', description: 'Lada putih premium dari Pulau Bangka dengan cita rasa pedas khas dan aroma yang kuat. Dibudidayakan secara tradisional oleh petani lokal.', benefits: 'Kaya antioksidan, membantu pencernaan, anti-inflamasi' },
    { name: 'Kayu Manis Keriting', price: 45000, stock: 150, category: 'Rempah Utuh', weight: '100g', origin: 'Kerinci, Jambi', description: 'Kayu manis kualitas terbaik dari dataran tinggi Kerinci. Aroma manis dan hangat yang khas, cocok untuk masakan dan minuman.', benefits: 'Mengontrol gula darah, antioksidan, anti-inflamasi' },
    { name: 'Cengkeh Sikka', price: 65000, stock: 120, category: 'Rempah Utuh', weight: '100g', origin: 'Flores, NTT', description: 'Cengkeh asli dari Flores dengan kandungan minyak atsiri tinggi. Aroma kuat dan tajam, digunakan untuk rempah masakan dan rokok kretek.', benefits: 'Antiseptik alami, meredakan sakit gigi, meningkatkan imunitas' },
    { name: 'Pala Ful Ful', price: 120000, stock: 80, category: 'Rempah Utuh', weight: '100g', origin: 'Ternate, Maluku Utara', description: 'Pala berkualitas Ful Ful dari Ternate, dikenal sebagai "Raja Rempah". Aroma khas dengan rasa hangat dan sedikit manis.', benefits: 'Meningkatkan fungsi otak, antioksidan, membantu tidur' },
    { name: 'Jahe Emprit', price: 35000, stock: 300, category: 'Rempah Utuh', weight: '250g', origin: 'Jawa Tengah', description: 'Jahe emprit atau jahe kunyit dengan ukuran kecil namun rasa pedas dan aromatik. Ideal untuk minuman tradisional dan bumbu masak.', benefits: 'Meredakan mual, anti-inflamasi, meningkatkan metabolisme' },
    { name: 'Kunyit Bubuk', price: 25000, stock: 250, category: 'Rempah Bubuk', weight: '100g', origin: 'Jawa Timur', description: 'Kunyit bubuk murni tanpa campuran. Warna kuning cerah dan aroma khas. Cocok untuk masakan, minuman kesehatan, dan jamu.', benefits: 'Antioksidan kuat, anti-inflamasi, meningkatkan imunitas' },
    { name: 'Kencur', price: 30000, stock: 180, category: 'Rempah Utuh', weight: '200g', origin: 'Jawa Barat', description: 'Kencur segar berkualitas tinggi. Aroma khas dan rasa pedas segar. Bahan utama jamu tradisional dan bumbu masakan Nusantara.', benefits: 'Meredakan batuk, meningkatkan nafsu makan, anti-inflamasi' },
    { name: 'Lengkuas Bubuk', price: 28000, stock: 200, category: 'Rempah Bubuk', weight: '100g', origin: 'Sulawesi Utara', description: 'Lengkuas bubuk murni dari laos pilihan. Aroma segar khas. Bumbu wajib untuk rendang, gulai, dan masakan Nusantara lainnya.', benefits: 'Anti-jamur, membantu pencernaan, antioksidan' },
    { name: 'Sereh Wangi', price: 20000, stock: 350, category: 'Rempah Utuh', weight: '200g', origin: 'Sumatera Barat', description: 'Sereh wangi segar dari dataran tinggi. Aroma citrus yang menyegarkan. Cocok untuk masakan, minuman, dan aromaterapi.', benefits: 'Meredakan stres, membantu pencernaan, antioksidan' },
    { name: 'Daun Salam Kering', price: 18000, stock: 400, category: 'Rempah Utuh', weight: '50g', origin: 'Jawa Barat', description: 'Daun salam kering pilihan dengan aroma khas. Bumbu penting untuk berbagai masakan Indonesia seperti sayur asem, sop, dan rendang.', benefits: 'Menurunkan kolesterol, antioksidan, membantu pencernaan' },
    { name: 'Minyak Kayu Putih', price: 55000, stock: 100, category: 'Minyak Atsiri', weight: '100ml', origin: 'Ambon, Maluku', description: 'Minyak kayu putih asli dari Ambon. Distilasi tradisional dari daun kayu putih. Aroma kuat dan hangat.', benefits: 'Meredakan masuk angin, menghangatkan tubuh, aromaterapi' },
    { name: 'Bubuk Kari Spesial', price: 40000, stock: 160, category: 'Bumbu Jadi', weight: '100g', origin: 'Indonesia', description: 'Campuran rempah pilihan untuk bubuk kari spesial. Kombinasi sempurna kunyit, ketumbar, jinten, lada, dan rempah lainnya.', benefits: 'Praktis, kaya antioksidan, cita rasa autentik' },
  ]

  for (const p of products) {
    const slug = p.name.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '')
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: p.name, slug, description: p.description, price: p.price, stock: p.stock,
        weight: p.weight, origin: p.origin, benefits: p.benefits, sku: `SKU-${slug.slice(0, 20).toUpperCase()}`,
        categoryId: catRecords[p.category],
      },
    })
  }
  console.log(`  ✅ ${products.length} products created`)

  // 5. Testimonials
  const testimonials = [
    { name: 'Budi Santoso', content: 'Rempah Indonesia menyediakan rempah berkualitas terbaik. Saya sangat puas dengan pelayanan dan kualitas produknya.', rating: 5 },
    { name: 'Siti Nurhaliza', content: 'Sudah berlangganan sejak 2022. Rempahnya selalu segar dan aroma nya sangat kuat. Sangat direkomendasikan!', rating: 5 },
    { name: 'Ahmad Fauzi', content: 'Saya pemilik restoran dan selalu menggunakan Rempah Indonesia. Kualitas konsisten dan pengiriman cepat.', rating: 5 },
  ]
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t })
  }
  console.log('  ✅ 3 testimonials created')

  // 6. FAQs
  const faqs = [
    { question: 'Apa itu Rempah Indonesia?', answer: 'Rempah Indonesia adalah perusahaan yang menyediakan rempah-rempah asli berkualitas tinggi dari berbagai daerah di Indonesia. Kami bekerja sama langsung dengan petani lokal untuk memastikan kualitas terbaik.', order: 1 },
    { question: 'Apakah produk yang dijual asli Indonesia?', answer: 'Ya, semua produk kami berasal langsung dari daerah asalnya di Indonesia seperti Lada Putih dari Bangka, Pala dari Ternate, dan Kayu Manis dari Kerinci.', order: 2 },
    { question: 'Bagaimana cara memesan?', answer: 'Anda dapat memesan melalui website kami. Tambahkan produk ke keranjang, isi data diri, dan klik "Pesan via WhatsApp". Pesanan Anda akan langsung terkirim ke tim kami.', order: 3 },
    { question: 'Berapa lama pengiriman?', answer: 'Pengiriman Jakarta 1-2 hari kerja, Jawa 2-3 hari kerja, Luar Jawa 3-7 hari kerja tergantung lokasi.', order: 4 },
    { question: 'Apakah ada garansi kualitas?', answer: 'Tentu! Kami memberikan garansi kualitas 100% untuk semua produk. Jika Anda tidak puas, kami akan mengganti atau mengembalikan uang Anda.', order: 5 },
  ]
  for (const f of faqs) {
    await prisma.fAQ.create({ data: f })
  }
  console.log('  ✅ 5 FAQs created')

  // 7. Settings
  await prisma.setting.upsert({
    where: { key: 'whatsapp_number' },
    update: {},
    create: { key: 'whatsapp_number', value: '6281234567890' },
  })
  console.log('  ✅ Settings created')

  console.log('\\n🎉 Seeding completed successfully!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
