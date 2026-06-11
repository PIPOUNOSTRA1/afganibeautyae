import { FormEvent, useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  subtitle: string;
  problem: string;
  image: string;
  images?: string[];
  landingImage?: string;
  promise?: string;
  audience?: string;
  sku?: string;
  barcode?: string;
  category?: string;
  vendor?: string;
  status?: "active" | "draft";
  price: number;
  compareAt: number;
  cost?: number;
  stock: number;
  weight?: number;
  seoTitle?: string;
  seoDescription?: string;
  bullets: string[];
  ingredients: { name: string; dose: string }[];
};

type Order = {
  id: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  productName: string;
  quantity: number;
  total: number;
  status: "new" | "confirmed" | "shipped" | "cancelled";
};

type TrackingSettings = {
  metaPixelId: string;
  metaAccessToken: string;
  tiktokPixelId: string;
  tiktokAccessToken: string;
  snapchatPixelId: string;
  snapchatAccessToken: string;
  ga4MeasurementId: string;
  gtmContainerId: string;
};

const brand = {
  ar: "لمسة بيوتي",
  en: "Lamsa Beauty",
  line: "متجر العناية والجمال الخليجي",
};

const productsSeed: Product[] = [
  {
    id: "glow-serum",
    name: "سيروم جلو فيتامين C",
    subtitle: "إشراقة يومية للبشرة الباهتة وآثار التعب",
    problem: "للبشرة التي تبدو باهتة أو مرهقة وتحتاج خطوة خفيفة قبل المرطب وواقي الشمس.",
    image: "https://images.pexels.com/photos/8015898/pexels-photo-8015898.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    images: ["https://images.pexels.com/photos/8015898/pexels-photo-8015898.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "https://images.pexels.com/photos/6167447/pexels-photo-6167447.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "/images/nawa-before-after.jpg"],
    landingImage: "/images/nawa-before-after.jpg",
    promise: "خطوة مركزة تمنح روتينك إحساسا أوضح بالإشراقة، مع شرح بسيط لطريقة الاستخدام ومتى تتوقعين النتيجة.",
    audience: "مناسب لمن تريد بداية سهلة في عالم السيرومات دون تعقيد أو خلط منتجات كثيرة.",
    sku: "LB-SER-C01",
    category: "العناية بالبشرة",
    vendor: "Lamsa Beauty",
    status: "active",
    cost: 38,
    seoTitle: "سيروم فيتامين C للإشراقة والعناية اليومية",
    seoDescription: "سيروم جلو للعناية بالبشرة الباهتة مع دفع عند الاستلام وشحن سريع.",
    price: 119,
    compareAt: 169,
    stock: 34,
    bullets: ["ملمس خفيف", "مناسب للروتين الصباحي", "شرح استخدام واضح", "ضمان رضا 30 يوم"],
    ingredients: [
      { name: "Vitamin C Blend", dose: "10%" },
      { name: "Hyaluronic Support", dose: "ترطيب خفيف" },
      { name: "Use", dose: "صباحا قبل المرطب" },
    ],
  },
  {
    id: "barrier-cream",
    name: "كريم ترطيب بارير ريبير",
    subtitle: "ترطيب يومي للبشرة الجافة والحساسة",
    problem: "للبشرة التي تشعر بالشد أو الجفاف بعد الغسول أو المكيف أو الجو الحار.",
    image: "https://images.pexels.com/photos/6167447/pexels-photo-6167447.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    images: ["https://images.pexels.com/photos/6167447/pexels-photo-6167447.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "https://images.pexels.com/photos/7691165/pexels-photo-7691165.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "https://images.pexels.com/photos/9774854/pexels-photo-9774854.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
    landingImage: "https://images.pexels.com/photos/9774854/pexels-photo-9774854.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    promise: "كريم يومي مريح يجعل خطوة الترطيب واضحة، بسيطة، ومناسبة للاستخدام صباحا ومساء.",
    audience: "مناسب لمن تريد كريم ترطيب موثوق دون ملمس ثقيل أو وعود مبالغ فيها.",
    sku: "LB-SKN-CRM",
    category: "العناية بالبشرة",
    vendor: "Lamsa Beauty",
    status: "active",
    cost: 31,
    seoTitle: "كريم ترطيب للبشرة الجافة والحساسة",
    seoDescription: "كريم ترطيب يومي مع تجربة شراء COD وشحن سريع.",
    price: 89,
    compareAt: 139,
    stock: 48,
    bullets: ["ترطيب يومي", "ملمس مريح", "صباحا ومساء", "شحن سريع"],
    ingredients: [
      { name: "Ceramide Complex", dose: "دعم الحاجز" },
      { name: "Glycerin", dose: "ترطيب" },
      { name: "Use", dose: "بعد الغسول" },
    ],
  },
  {
    id: "argan-hair-oil",
    name: "زيت الأرغان للشعر اللامع",
    subtitle: "لمسة نهائية للشعر الجاف والمتطاير",
    problem: "للشعر الذي يفقد لمعانه بسرعة أو يظهر عليه الهيشان بعد الاستشوار والرطوبة.",
    image: "https://images.pexels.com/photos/6429662/pexels-photo-6429662.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    images: ["https://images.pexels.com/photos/6429662/pexels-photo-6429662.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "https://images.pexels.com/photos/7428095/pexels-photo-7428095.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "https://images.pexels.com/photos/8468019/pexels-photo-8468019.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
    landingImage: "https://images.pexels.com/photos/7428095/pexels-photo-7428095.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    promise: "قطرات قليلة بعد التصفيف تمنح الشعر مظهرا أكثر ترتيبا ولمعانا دون تعقيد في الروتين.",
    audience: "مناسب لمن تريد منتجا سريعا للشعر الجاف، الأطراف، والهيشان اليومي.",
    sku: "LB-HAR-OIL",
    category: "العناية بالشعر",
    vendor: "Lamsa Beauty",
    status: "active",
    cost: 34,
    seoTitle: "زيت الأرغان للشعر الجاف والمتطاير",
    seoDescription: "زيت شعر خفيف للمعان وتقليل الهيشان مع دفع عند الاستلام.",
    price: 99,
    compareAt: 149,
    stock: 22,
    bullets: ["للأطراف الجافة", "لمعان فوري", "استخدام بعد التصفيف", "الدفع عند الاستلام"],
    ingredients: [
      { name: "Argan Oil", dose: "لمعان وتنعيم" },
      { name: "Vitamin E", dose: "عناية بالأطراف" },
      { name: "Use", dose: "قطرتان على الأطراف" },
    ],
  },
  {
    id: "body-lotion",
    name: "لوشن بودي سيلك",
    subtitle: "ترطيب للجسم بعد الاستحمام",
    problem: "لجفاف الجسم بعد الاستحمام أو الحلاقة أو التعرض للمكيف لفترات طويلة.",
    image: "https://images.pexels.com/photos/14438270/pexels-photo-14438270.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    images: ["https://images.pexels.com/photos/14438270/pexels-photo-14438270.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "https://images.pexels.com/photos/5240655/pexels-photo-5240655.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "https://images.pexels.com/photos/6690916/pexels-photo-6690916.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
    landingImage: "https://images.pexels.com/photos/5240655/pexels-photo-5240655.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    promise: "لوشن يومي سريع الامتصاص يجعل ترطيب الجسم عادة سهلة بعد الاستحمام.",
    audience: "مناسب لمن تريد نعومة يومية بدون ملمس لزج أو عطر مزعج.",
    sku: "LB-BDY-LOT",
    category: "العناية بالجسم",
    vendor: "Lamsa Beauty",
    status: "active",
    cost: 27,
    seoTitle: "لوشن جسم مرطب سريع الامتصاص",
    seoDescription: "لوشن بودي سيلك للعناية اليومية بالجسم مع شحن سريع.",
    price: 79,
    compareAt: 119,
    stock: 57,
    bullets: ["بعد الاستحمام", "سريع الامتصاص", "نعومة يومية", "مناسب للهدايا"],
    ingredients: [
      { name: "Shea Butter", dose: "نعومة" },
      { name: "Aloe Vera", dose: "راحة للبشرة" },
      { name: "Use", dose: "على بشرة رطبة" },
    ],
  },
  {
    id: "cleanse-device",
    name: "فرشاة تنظيف الوجه سيليكون",
    subtitle: "تنظيف أعمق للروتين المسائي",
    problem: "لمن تشعر أن الغسول وحده لا يزيل بقايا اليوم أو تحتاج أداة لطيفة لتنظيم الروتين.",
    image: "https://images.pexels.com/photos/17935140/pexels-photo-17935140.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    images: ["https://images.pexels.com/photos/17935140/pexels-photo-17935140.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "https://images.pexels.com/photos/8740315/pexels-photo-8740315.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "https://images.pexels.com/photos/9775357/pexels-photo-9775357.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
    landingImage: "https://images.pexels.com/photos/8740315/pexels-photo-8740315.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    promise: "أداة بسيطة تجعل تنظيف البشرة خطوة أكثر انتظاما وتشعر العميلة بفرق في تجربة الروتين نفسها.",
    audience: "مناسبة لمن تريد أداة عناية لا تحتاج خبرة، وتستخدم مع الغسول المفضل لديها.",
    sku: "LB-TOL-CLN",
    category: "أدوات الجمال",
    vendor: "Lamsa Beauty",
    status: "active",
    cost: 42,
    seoTitle: "فرشاة تنظيف وجه سيليكون للروتين اليومي",
    seoDescription: "فرشاة تنظيف وجه للروتين المسائي مع COD وضمان استبدال.",
    price: 129,
    compareAt: 189,
    stock: 41,
    bullets: ["سيليكون ناعم", "تستخدم مع الغسول", "شحن USB", "ضمان استبدال"],
    ingredients: [
      { name: "Material", dose: "سيليكون ناعم" },
      { name: "Modes", dose: "درجات متعددة" },
      { name: "Use", dose: "60 ثانية مساء" },
    ],
  },
  {
    id: "roller-set",
    name: "مجموعة رولر و غواشا روز كوارتز",
    subtitle: "طقس عناية فاخر للتدليك وتخفيف الانتفاخ",
    problem: "لمن تحب روتين عناية هادئ قبل النوم أو قبل المكياج، وتريد أداة تصويرية وجميلة للهدايا.",
    image: "https://images.pexels.com/photos/8015881/pexels-photo-8015881.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    images: ["https://images.pexels.com/photos/8015881/pexels-photo-8015881.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "https://images.pexels.com/photos/8015898/pexels-photo-8015898.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "https://images.pexels.com/photos/7691165/pexels-photo-7691165.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
    landingImage: "https://images.pexels.com/photos/8015881/pexels-photo-8015881.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    promise: "مجموعة أنيقة تضيف إحساس السبا إلى روتين البيت، وتصلح كهدية جميلة وعملية.",
    audience: "مناسبة لمحبات العناية الهادئة، التصوير، والهدايا النسائية الراقية.",
    sku: "LB-TOL-RQZ",
    category: "أدوات الجمال",
    vendor: "Lamsa Beauty",
    status: "active",
    cost: 29,
    seoTitle: "مجموعة رولر وغواشا روز كوارتز للعناية",
    seoDescription: "مجموعة أدوات تدليك للوجه بتصميم أنيق وشحن سريع.",
    price: 89,
    compareAt: 139,
    stock: 66,
    bullets: ["هدية أنيقة", "للتدليك اليومي", "روتين قبل المكياج", "تغليف جميل"],
    ingredients: [
      { name: "Set", dose: "رولر + غواشا" },
      { name: "Material", dose: "Rose Quartz style" },
      { name: "Use", dose: "مع السيروم أو المرطب" },
    ],
  },
];

const reviews = [
  {
    text: "أعجبني أن المتجر لا يبيع منتجا واحدا فقط. وجدت سيروم، ترطيب، وأدوات عناية بنفس أسلوب العرض الواضح.",
    name: "سارة العتيبي",
    meta: "32 سنة، الرياض، مشترية مؤكدة",
  },
  {
    text: "صفحة المنتج فيها صور واستخدامات وأسئلة، مو مجرد صورة وسعر. هذا خلاني أطلب بالدفع عند الاستلام بثقة.",
    name: "نورة الدوسري",
    meta: "38 سنة، جدة، مشترية مؤكدة",
  },
  {
    text: "أخذت زيت الشعر ولوشن الجسم. التغليف كان مرتب والتواصل على واتساب سريع قبل الشحن.",
    name: "فاطمة الخالدي",
    meta: "35 سنة، الدمام، مشترية مؤكدة",
  },
];

const faqs = [
  ["هل المنتجات أصلية؟", "المتجر مصمم لعرض المورد، SKU، صور المنتج، ومعلومات الاستخدام بوضوح. في الإنتاج أضف شهادات المورد والفواتير من لوحة التحكم."],
  ["هل الدفع عند الاستلام متاح؟", "نعم. تجربة الطلب مبنية للدفع عند الاستلام، مع تأكيد عبر واتساب قبل الشحن."],
  ["كم مدة التوصيل؟", "داخل المدن الرئيسية في السعودية من 1 إلى 3 أيام عمل، وباقي المناطق من 3 إلى 5 أيام."],
  ["هل أستطيع طلب أكثر من منتج؟", "نعم، المتجر قابل للتوسع إلى مجموعات عناية كاملة: بشرة، شعر، جسم، وأدوات جمال."],
  ["هل يوجد ضمان؟", "نعم، يمكنك تفعيل ضمان رضا 30 يوم من لوحة المحتوى وربطه بسياسة الاسترجاع."],
];

function landingCopy(product: Product) {
  const baseReviews = {
    "glow-serum": [
      ["كنت أخاف من السيرومات لأنها كثيرة ومربكة. شرح الاستخدام والصور خلوني أفهم أين أضعه في روتيني.", "مها", "الرياض"],
      ["أعجبني أن الصفحة لم تبالغ. قالت لي كيف أستخدمه ومتى أقيم التجربة، وهذا أقنعني أكثر من الوعود الكبيرة.", "ريم", "جدة"],
      ["طلبت بعد ما شفت الصور والأسئلة. تأكيد الواتساب كان سريع والدفع عند الاستلام مريح.", "نورة", "الخبر"],
    ],
    "barrier-cream": [
      ["بشرتي تجف من المكيف. أعجبني أنه كريم واضح للترطيب وليس منتج يدعي حل كل شيء.", "سارة", "الدمام"],
      ["الطلب كان سهل، الاسم والجوال فقط، والدفع وقت الاستلام. هذا رفع ثقتي جدا.", "عبير", "مكة"],
      ["أحببت أن الصفحة توضح متى أستخدمه مع الغسول والسيروم. هذا يجعل الروتين أسهل.", "لينا", "الرياض"],
    ],
    "argan-hair-oil": [
      ["أطراف شعري كانت تنفش بعد الاستشوار. المنتج واضح أنه للّمسات الأخيرة وليس علاج مبالغ فيه.", "هند", "جدة"],
      ["شدني شرح كمية الاستخدام. كثير زيوت تثقل الشعر لأننا لا نعرف كم نضع.", "دانة", "الرياض"],
      ["الصور أعطتني فكرة عن القوام وطريقة الاستخدام. طلبته مع اللوشن كتجربة أولى.", "أمل", "المدينة"],
    ],
    "body-lotion": [
      ["اللوشن سريع الامتصاص وهذا أكثر شيء أريده بعد الاستحمام. صفحة المنتج جاوبت على سؤال الملمس.", "جود", "الطائف"],
      ["طلبته كهدية مع الرولر. العرض كان واضحا والتوصيل سريع.", "منال", "الرياض"],
      ["أحب المنتجات التي تشرح متى أستخدمها. هذه الصفحة جعلت القرار أسهل.", "رنا", "الدمام"],
    ],
    "cleanse-device": [
      ["كنت مترددة من أجهزة التنظيف، لكن شرح 60 ثانية مع الغسول جعلها تبدو بسيطة.", "لمى", "الرياض"],
      ["أعجبني وجود ضمان استبدال. الأدوات تحتاج ثقة أكثر من الكريمات.", "سمر", "جدة"],
      ["اشتريتها لأن الصفحة أوضحت أنها أداة مساعدة وليست وعدا خياليا.", "مي", "الخبر"],
    ],
    "roller-set": [
      ["شكلها جميل جدا كهدية، وصفحة المنتج عرضت استخدامها مع السيروم والمرطب.", "شهد", "مكة"],
      ["أحب روتين المساء الهادئ. الصور والشرح خلوني أتخيل استخدامها قبل الطلب.", "روان", "الرياض"],
      ["طلبتها مع كريم الترطيب، والتأكيد على واتساب كان واضحا وسريعا.", "أسماء", "جدة"],
    ],
  } as Record<string, string[][]>;

  return {
    hook: product.promise ?? "روتين جمالي واضح، سهل الالتزام، ومصمم للعميلة التي تريد قرار شراء مطمئن.",
    audience: product.audience ?? product.problem,
    mechanism: [
      ["مشكلة واضحة", "كل منتج مخصص لاستخدام محدد حتى لا تشعر العميلة أنها تشتري شيئا عاما وغير مفهوم."],
      ["تفاصيل قبل الطلب", "المكونات أو المواصفات وطريقة الاستخدام ظاهرة بوضوح قبل نموذج COD."],
      ["روتين أسهل", "الصفحة تشرح أين يدخل المنتج في روتين العناية اليومي حتى يصبح القرار أبسط."],
    ],
    deepExplanation: [
      ["الفكرة", `${product.name} ليس منتجا يبيع وعدا غامضا. الصفحة تشرح من هو مناسب له، ما هي المواصفات، وكيف يدخل في روتين العناية.`],
      ["طريقة الاستخدام", "استخدميه ضمن خطوة واضحة في الروتين كما هو موضح في الصفحة. الأهم هو الاستمرارية وعدم خلط منتجات كثيرة بلا خطة."],
      ["متى أقرر؟", "إذا كنت تبحثين عن روتين بسيط، بدون كبسولات، وبدون دفع مسبق، فهذا المنتج مصمم ليقلل التردد ويعطيك تجربة شراء آمنة."],
    ],
    timeline: [
      ["اليوم 1", "تأكيد الطلب عبر واتساب، مراجعة العنوان، وتجهيز الشحنة."],
      ["الأسبوع 1", "بداية الالتزام بروتين يومي واضح وسهل التذكر."],
      ["الأسبوع 2-4", "تقييم التجربة بهدوء عبر الصور، الإحساس العام، ومدى الالتزام اليومي."],
    ],
    comparison: [
      ["اختيار بلا شرح", "صورة واحدة وسعر فقط، فتظل العميلة غير متأكدة من الاستخدام."],
      ["اختيار واضح", "صور متعددة، طريقة استخدام، مواصفات، آراء، ضمان، وطلب بدون دفع."],
      ["منتج عشوائي", "غير واضح متى يستخدم، لمن يناسب، أو لماذا سعره منطقي."],
      ["منتج منسق", "جزء من روتين عناية واضح: بشرة، شعر، جسم، أو أداة جمال."],
    ],
    customerQuestions: [
      ["أنا جربت منتجات كثيرة وما شفت فرق، لماذا أطلب؟", "لأن القرار هنا ليس مبنيا على وعد مبالغ فيه. المنتج يوضح الاستخدام والمواصفات، ويقدم COD وضمانا لتجربة أولى أقل مخاطرة."],
      ["هل هذا يغني عن العناية الخارجية؟", "لا. الأفضل استخدامه كجزء من روتين متكامل: نوم، ماء، واقي شمس، وتنظيف مناسب. هذا الصدق يرفع الثقة ويقلل الإرجاع."],
      ["هل يناسبني لو عندي حساسية أو حمل؟", "إذا لديك حساسية، حمل، رضاعة، أو حالة طبية، يجب استشارة مختص قبل الاستخدام. الشفافية هنا أهم من إغلاق الطلب بأي ثمن."],
      ["لماذا السعر أعلى من منتجات عادية؟", "لأن العرض لا يبيع المنتج فقط: صور واضحة، شرح استخدام، تجربة COD، متابعة واتساب، ومعلومات كافية تقلل المخاطرة."],
      ["ماذا يحدث بعد إرسال الطلب؟", "تصلك رسالة واتساب للتأكيد، يتم مراجعة العنوان، ثم تشحن الطلبية. لا تدفعين إلا عند الاستلام."],
    ],
    beforeAfter: [
      ["قبل", "تجارب عشوائية، منتجات كثيرة، وصف غير واضح، وتردد قبل الدفع."],
      ["بعد", "روتين واحد، مكونات ظاهرة، ضمان واضح، وطلب COD بدون مخاطرة."],
    ],
    objections: [
      ["أخاف ما يناسبني", "ابدئي بعلبة واحدة، ومع ضمان الرضا تقل المخاطرة قبل الالتزام بروتين كامل."],
      ["ما أثق بالمتاجر الجديدة", "الدفع عند الاستلام، واتساب تأكيد، ومعلومات مكونات واضحة قبل الشراء."],
      ["هل النتيجة فورية؟", "الصفحة لا تعد بنتيجة فورية. الفكرة هي روتين يومي منظم تدعمينه بالاستمرار."],
    ],
    reviews: baseReviews[product.id] ?? baseReviews["glow-serum"],
  };
}

function useStoredState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

function money(value: number) {
  return new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR", maximumFractionDigits: 0 }).format(value);
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-full bg-[#5F2E3D] text-[#F8D8D8] shadow-xl shadow-rose-950/10">
        <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden="true">
          <path d="M24 38c8-4 14-10 14-19 0-5-3-9-8-9-3 0-5 2-6 4-1-2-3-4-6-4-5 0-8 4-8 9 0 9 6 15 14 19Z" fill="currentColor" />
          <path d="M18 23c3 0 6 2 6 7 0-5 3-7 6-7" stroke="#5F2E3D" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="leading-tight">
        <p className="text-xl font-black tracking-tight text-[#3B2530]">{brand.ar}</p>
        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#B9827A]">{brand.en}</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-black text-[#3B2530]">
      {label}
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="rounded-2xl border border-[#EAD8D2] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B9827A] focus:ring-4 focus:ring-[#B9827A]/15" />;
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="min-h-24 rounded-2xl border border-[#EAD8D2] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B9827A] focus:ring-4 focus:ring-[#B9827A]/15" />;
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className="rounded-2xl border border-[#EAD8D2] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B9827A] focus:ring-4 focus:ring-[#B9827A]/15" />;
}

export default function App() {
  const [products, setProducts] = useStoredState<Product[]>("lamsa-products-v1", productsSeed);
  const [orders, setOrders] = useStoredState<Order[]>("lamsa-orders-v1", []);
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [drawer, setDrawer] = useState<"product" | "checkout" | "admin" | null>(null);
  const [toast, setToast] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useStoredState("lamsa-admin", false);
  const [homeCopy, setHomeCopy] = useStoredState("lamsa-copy-v1", {
    heroTitle: "متجر عناية وجمال متنوع لروتينك اليومي، من البشرة إلى الشعر والجسم",
    heroBody: "منتجات مختارة بعناية: سيرومات، كريمات، زيوت شعر، لوشن جسم، وأدوات جمال. شرح واضح، صور استخدام، دفع عند الاستلام، وضمان رضا.",
    ribbon: "منتجات عناية وجمال مختارة · COD · شحن سريع · ضمان رضا 30 يوم",
  });
  const [tracking, setTracking] = useStoredState<TrackingSettings>("lamsa-tracking-v1", {
    metaPixelId: "",
    metaAccessToken: "",
    tiktokPixelId: "",
    tiktokAccessToken: "",
    snapchatPixelId: "",
    snapchatAccessToken: "",
    ga4MeasurementId: "",
    gtmContainerId: "",
  });

  const selected = products.find((product) => product.id === selectedId) ?? products[0];
  const revenue = orders.filter((order) => order.status !== "cancelled").reduce((sum, order) => sum + order.total, 0);

  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Store",
      name: brand.en,
      alternateName: brand.ar,
      paymentAccepted: ["Cash on Delivery", "Mada on delivery"],
      areaServed: "Saudi Arabia",
      makesOffer: products.map((product) => ({
        "@type": "Offer",
        price: product.price,
        priceCurrency: "SAR",
        itemOffered: { "@type": "Product", name: product.name, image: product.image },
      })),
    };
    let script = document.getElementById("lamsa-schema") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "lamsa-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }, [products]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function openProduct(product: Product) {
    setSelectedId(product.id);
    setQuantity(1);
    setDrawer("product");
  }

  function createOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    const order: Order = {
      id: `NW-${Math.floor(1000 + Math.random() * 9000)}`,
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      city: String(form.get("city") ?? ""),
      address: String(form.get("address") ?? ""),
      productName: selected.name,
      quantity,
      total: selected.price * quantity,
      status: "new",
    };
    setOrders((current) => [order, ...current]);
    setProducts((current) => current.map((product) => (product.id === selected.id ? { ...product, stock: Math.max(0, product.stock - quantity) } : product)));
    setDrawer(null);
    notify("تم تسجيل الطلب، فريق التأكيد بيتواصل معك على واتساب");
  }

  function Hero() {
    return (
      <section className="relative isolate min-h-[88vh] overflow-hidden bg-[#F9F0EA]">
        <img src="https://images.pexels.com/photos/8015898/pexels-photo-8015898.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600" alt="منتجات العناية والجمال من لمسة بيوتي" className="absolute inset-0 h-full w-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#F9F0EA]/96 via-[#F9F0EA]/82 to-[#F9F0EA]/18" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-[fadeUp_.75s_ease-out_both]">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.35em] text-[#B9827A]">{brand.line}</p>
            <p className="text-6xl font-black tracking-tight text-[#5F2E3D] sm:text-8xl">{brand.ar}</p>
            <h1 className="mt-6 text-3xl font-black leading-tight text-[#3B2530] sm:text-5xl">{homeCopy.heroTitle}</h1>
            <p className="mt-5 text-lg leading-9 text-[#6D5960] sm:text-xl">{homeCopy.heroBody}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => document.getElementById("formulations")?.scrollIntoView({ behavior: "smooth" })} className="rounded-full bg-[#5F2E3D] px-8 py-4 text-base font-black text-white shadow-2xl shadow-rose-950/20 transition hover:-translate-y-1 hover:bg-[#3B2530]">
                تسوقي المنتجات الآن
              </button>
              <button onClick={() => setDrawer("admin")} className="rounded-full border border-[#5F2E3D]/20 bg-white/65 px-8 py-4 text-base font-black text-[#5F2E3D] backdrop-blur transition hover:-translate-y-1 hover:bg-white">
                لوحة التشغيل
              </button>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm font-black text-[#5F2E3D] sm:grid-cols-4">
              {['Skincare', 'Haircare', 'Beauty Tools', 'COD'].map((item) => <span key={item} className="border-t border-[#B9827A]/35 pt-3">{item}</span>)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  function Header() {
    return (
      <header className="sticky top-0 z-40 border-b border-[#EAD8D2] bg-[#FFF9F4]/88 backdrop-blur-xl">
        <div className="bg-[#5F2E3D] px-4 py-2 text-center text-xs font-black text-[#F8D8D8] sm:text-sm">{homeCopy.ribbon}</div>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-black text-[#6D5960] md:flex">
            <a href="#formulations" className="hover:text-[#5F2E3D]">المنتجات</a>
            <a href="#why" className="hover:text-[#5F2E3D]">لماذا لمسة</a>
            <a href="#reviews" className="hover:text-[#5F2E3D]">تجارب موثقة</a>
            <a href="#faq" className="hover:text-[#5F2E3D]">الأسئلة</a>
          </nav>
          <button onClick={() => selected && openProduct(selected)} className="rounded-full bg-[#3B2530] px-5 py-3 text-sm font-black text-white shadow-lg shadow-rose-950/15">اطلبي الآن</button>
        </div>
      </header>
    );
  }

  function ProductsSection() {
    return (
      <section id="formulations" className="bg-[#FFF9F4] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.32em] text-[#B9827A]">Curated Beauty Products</p>
            <h2 className="mt-4 text-4xl font-black text-[#3B2530] sm:text-6xl">منتجات متنوعة لكل خطوة في روتين العناية</h2>
            <p className="mt-5 text-lg leading-9 text-[#6D5960]">اختاري حسب الحاجة: إشراقة، ترطيب، شعر، جسم، أو أدوات جمال. كل منتج يعرض طريقة الاستخدام، الصور، الأسئلة المهمة، والطلب بدون دفع مسبق.</p>
          </div>
          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {products.map((product, index) => (
              <article key={product.id} className="group overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-rose-950/7 transition duration-500 hover:-translate-y-2">
                <button onClick={() => openProduct(product)} className="block w-full text-start">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F9F0EA]">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <p className="text-sm font-black text-[#B9827A]">منتج 0{index + 1}</p>
                    <h3 className="mt-2 text-2xl font-black text-[#3B2530]">{product.name}</h3>
                    <p className="mt-3 min-h-14 leading-7 text-[#6D5960]">{product.subtitle}</p>
                    <div className="mt-6 flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-black text-[#5F2E3D]">{money(product.price)}</p>
                        <p className="text-sm font-bold text-[#B8A3A1] line-through">{money(product.compareAt)}</p>
                      </div>
                      <span className="rounded-full bg-[#5F2E3D] px-5 py-3 text-sm font-black text-white">تفاصيل</span>
                    </div>
                  </div>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function WhySection() {
    const items = [
      ["اختيار منسق", "المنتجات ليست عشوائية: بشرة، شعر، جسم، وأدوات جمال ضمن روتين واضح."],
      ["صور واستخدامات", "كل منتج يعرض صورا واقعية، طريقة استخدام، وما يناسبه قبل الطلب."],
      ["مواصفات واضحة", "السعر، المزايا، المكونات أو المواصفات، والمخزون تظهر للعميلة بشفافية."],
      ["COD بلا مخاطرة", "اسم ورقم جوال، تأكيد واتساب، ثم دفع عند الاستلام نقد أو مدى."],
    ];
    return (
      <section id="why" className="bg-[#F9F0EA] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.32em] text-[#B9827A]">Why Lamsa Beauty</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-[#3B2530] sm:text-6xl">متجر عناية وجمال يشعر العميلة أنه منظم، موثوق، وسهل الشراء.</h2>
            <p className="mt-6 text-lg leading-9 text-[#6D5960]">الثقة هنا تأتي من تنوع المنتجات، وضوح صفحات الهبوط، الصور الواقعية، الضمان، وتجربة طلب قصيرة للدفع عند الاستلام.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map(([title, text], index) => (
              <div key={title} className="border-t border-[#B9827A]/30 pt-5">
                <p className="text-4xl font-black text-[#B9827A]">0{index + 1}</p>
                <h3 className="mt-4 text-2xl font-black text-[#3B2530]">{title}</h3>
                <p className="mt-3 leading-8 text-[#6D5960]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function ReviewsSection() {
    return (
      <section id="reviews" className="bg-[#3B2530] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.32em] text-[#F8D8D8]">Verified Reviews</p>
            <h2 className="mt-4 text-4xl font-black sm:text-6xl">لعميلة تقرأ وتتأكد قبل أن تشتري</h2>
            <p className="mt-5 text-lg leading-9 text-white/70">نصوص مراجعات طويلة نسبيا تشبه أسلوب العميلة السعودية الواقعية، وتدعم الثقة بدل عبارات عامة.</p>
          </div>
          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {reviews.map((review) => (
              <blockquote key={review.name} className="rounded-[2rem] bg-white/8 p-6 backdrop-blur">
                <p className="text-5xl font-black text-[#F8D8D8]">“</p>
                <p className="mt-3 text-lg leading-9 text-white/86">{review.text}</p>
                <footer className="mt-8 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#F8D8D8] font-black text-[#5F2E3D]">{review.name[0]}</span>
                  <span><b className="block">{review.name}</b><small className="text-white/60">{review.meta}</small></span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function HowItWorks() {
    const steps = [
      ["اختاري روتينك", "اختاري منتجا واحدا أو اجمعي روتينا كاملا حسب الحاجة: بشرة، شعر، جسم، أو أداة جمال."],
      ["أكدي طلبك بدون دفع", "اسمك ورقم جوالك فقط، وفريق التأكيد يتواصل معك قبل الشحن."],
      ["استلمي وادفعي", "توصيل للباب خلال 1 إلى 3 أيام داخل المدن الرئيسية والدفع عند الاستلام."],
    ];
    return (
      <section className="bg-[#FFF9F4] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.32em] text-[#B9827A]">How It Works</p>
            <h2 className="mt-4 text-4xl font-black text-[#3B2530] sm:text-6xl">بدون دفع أونلاين، بدون التزام، بدون مخاطرة</h2>
          </div>
          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {steps.map(([title, text], index) => (
              <div key={title} className="rounded-[2rem] bg-[#F9F0EA] p-8">
                <p className="text-6xl font-black text-[#B9827A]">{index + 1}</p>
                <h3 className="mt-6 text-2xl font-black text-[#3B2530]">{title}</h3>
                <p className="mt-3 leading-8 text-[#6D5960]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function CtaFaq() {
    return (
      <>
        <section className="bg-[#F9F0EA] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-[#5F2E3D] px-6 py-14 text-center text-white shadow-2xl shadow-rose-950/20 sm:px-12">
            <p className="text-sm font-black uppercase tracking-[0.32em] text-[#F8D8D8]">Build Your Beauty Routine</p>
            <h2 className="mt-4 text-4xl font-black sm:text-6xl">ابدئي روتين العناية المناسب لك اليوم</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-9 text-white/76">الدفع عند الاستلام، شحن داخل المملكة، وضمان رضا 30 يوم. تجربة مصممة لتقليل التردد ورفع تأكيد الطلبات.</p>
            <button onClick={() => selected && openProduct(selected)} className="mt-8 rounded-full bg-[#F8D8D8] px-8 py-4 font-black text-[#5F2E3D] transition hover:-translate-y-1 hover:bg-white">تسوقي منتجات العناية الآن</button>
          </div>
        </section>
        <section id="faq" className="bg-[#FFF9F4] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.32em] text-[#B9827A]">FAQ</p>
              <h2 className="mt-4 text-4xl font-black text-[#3B2530] sm:text-6xl">كل شيء قبل الدفع عند الاستلام</h2>
            </div>
            <div className="space-y-3">
              {faqs.map(([q, a]) => (
                <details key={q} className="rounded-3xl bg-[#F9F0EA] p-6">
                  <summary className="cursor-pointer list-none text-xl font-black text-[#3B2530]">{q}</summary>
                  <p className="mt-4 leading-8 text-[#6D5960]">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  function ProductDrawer() {
    if (drawer !== "product" || !selected) return null;
    const copy = landingCopy(selected);
    const gallery = selected.images?.length ? selected.images : [selected.image, selected.landingImage ?? "/images/nawa-before-after.jpg"];
    const totalValue = selected.compareAt + 39 + 49 + 59;
    const realPhotos = [
      "https://images.pexels.com/photos/7038208/pexels-photo-7038208.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      "https://images.pexels.com/photos/9775355/pexels-photo-9775355.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      "https://images.pexels.com/photos/7038240/pexels-photo-7038240.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    ];
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FFF9F4] text-[#3B2530]">
        <header className="sticky top-0 z-20 border-b border-[#EAD8D2] bg-[#FFF9F4]/92 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <Logo />
            <div className="flex items-center gap-2">
              <button onClick={() => setDrawer("checkout")} className="rounded-full bg-[#5F2E3D] px-5 py-3 text-sm font-black text-white">اطلبي الآن</button>
              <button onClick={() => setDrawer(null)} className="rounded-full bg-[#F9F0EA] px-4 py-3 text-lg font-black text-[#5F2E3D]">×</button>
            </div>
          </div>
        </header>

        <main>
          <section className="relative isolate overflow-hidden bg-[#F9F0EA] px-4 py-14 sm:px-6 lg:px-8">
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent" />
            <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
              <div className="order-2 lg:order-1">
                <p className="text-sm font-black uppercase tracking-[0.32em] text-[#B9827A]">اختيار اليوم</p>
                <h1 className="mt-4 text-4xl font-black leading-tight text-[#3B2530] sm:text-6xl">{selected.name}</h1>
                <p className="mt-5 text-2xl font-black leading-10 text-[#5F2E3D]">{copy.hook}</p>
                <p className="mt-4 text-lg leading-9 text-[#6D5960]">{copy.audience}</p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {selected.bullets.map((bullet) => <span key={bullet} className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#5F2E3D] shadow-sm">{bullet}</span>)}
                </div>
                <div className="mt-8 rounded-[2rem] bg-white p-5 shadow-xl shadow-rose-950/8">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div><p className="text-sm font-black text-[#B9827A]">عرض اليوم مع الدفع عند الاستلام</p><p className="mt-1 text-5xl font-black text-[#5F2E3D]">{money(selected.price)}</p><p className="font-bold text-[#B8A3A1] line-through">{money(selected.compareAt)}</p></div>
                    <div className="text-sm font-black text-[#6D5960]"><p>✓ شحن سريع داخل السعودية</p><p>✓ ضمان رضا 30 يوم</p><p>✓ تأكيد واتساب قبل الشحن</p></div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-[130px_1fr]">
                    <div className="flex items-center justify-between rounded-full bg-[#F9F0EA] px-4 py-3">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-2xl font-black text-[#5F2E3D]">-</button>
                      <span className="font-black">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="text-2xl font-black text-[#5F2E3D]">+</button>
                    </div>
                    <button onClick={() => setDrawer("checkout")} className="rounded-full bg-[#5F2E3D] px-7 py-4 text-lg font-black text-white shadow-xl shadow-rose-950/20 transition hover:-translate-y-1">اطلبي بدون دفع الآن</button>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-rose-950/12">
                  <img src={selected.image} alt={selected.name} className="aspect-[4/5] w-full object-cover" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {gallery.slice(0, 3).map((image) => <img key={image} src={image} alt="صور المنتج" className="aspect-square rounded-3xl object-cover shadow-sm" />)}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.32em] text-[#B9827A]">شاهدي التفاصيل</p>
                  <h2 className="mt-4 text-4xl font-black text-[#3B2530] sm:text-5xl">المنتج كما ستستخدمينه في روتينك</h2>
                  <p className="mt-4 text-lg leading-9 text-[#6D5960]">شاهدي شكل المنتج، طريقة استخدامه، والنتيجة التي يساعدك على تنظيمها داخل روتين العناية اليومي.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {realPhotos.map((image, index) => <img key={image} src={image} alt={`صورة واقعية للمنتج ${index + 1}`} className="aspect-[4/5] rounded-[2rem] object-cover shadow-xl shadow-rose-950/8" />)}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.32em] text-[#B9827A]">Before / After</p>
                <h2 className="mt-4 text-4xl font-black text-[#3B2530] sm:text-5xl">ليس مجرد منتج، بل انتقال من التردد إلى روتين واضح</h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {copy.beforeAfter.map(([label, text]) => <div key={label} className={`rounded-[2rem] p-6 ${label === "بعد" ? "bg-[#5F2E3D] text-white" : "bg-[#F9F0EA] text-[#3B2530]"}`}><p className="text-sm font-black text-[#B9827A]">{label}</p><p className="mt-3 text-xl font-black leading-9">{text}</p></div>)}
                </div>
              </div>
              <img src={selected.landingImage ?? "/images/nawa-before-after.jpg"} alt="قبل وبعد" className="rounded-[2.5rem] object-cover shadow-2xl shadow-rose-950/10" />
            </div>
          </section>

          <section className="bg-[#F9F0EA] px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-3xl"><p className="text-sm font-black uppercase tracking-[0.32em] text-[#B9827A]">لماذا تختارينه؟</p><h2 className="mt-4 text-4xl font-black text-[#3B2530] sm:text-5xl">مزايا واضحة قبل أن ترسلي الطلب</h2></div>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {copy.mechanism.map(([title, text], index) => <div key={title} className="rounded-[2rem] bg-white p-6 shadow-sm shadow-rose-950/5"><p className="text-5xl font-black text-[#B9827A]">0{index + 1}</p><h3 className="mt-5 text-2xl font-black text-[#3B2530]">{title}</h3><p className="mt-3 leading-8 text-[#6D5960]">{text}</p></div>)}
              </div>
            </div>
          </section>

          <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.85fr_1.15fr]">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.32em] text-[#B9827A]">طريقة الاستخدام</p>
                <h2 className="mt-4 text-4xl font-black text-[#3B2530] sm:text-5xl">كيف يدخل المنتج في روتينك اليومي؟</h2>
                <p className="mt-4 text-lg leading-9 text-[#6D5960]">قبل الطلب، تعرفي على الفكرة، طريقة الاستخدام، متى يناسبك المنتج، وما الذي تتوقعينه بواقعية.</p>
              </div>
              <div className="grid gap-4">
                {copy.deepExplanation.map(([title, text]) => <div key={title} className="rounded-[2rem] bg-[#FFF9F4] p-6"><h3 className="text-2xl font-black text-[#3B2530]">{title}</h3><p className="mt-3 leading-8 text-[#6D5960]">{text}</p></div>)}
              </div>
            </div>
          </section>

          <section className="bg-[#3B2530] px-4 py-16 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.32em] text-[#F8D8D8]">اختيار أوضح</p>
                  <h2 className="mt-4 text-4xl font-black sm:text-5xl">ما الفرق بين شراء عشوائي وروتين منسق؟</h2>
                  <p className="mt-4 text-lg leading-9 text-white/70">المقارنة تساعدك تفهمين لماذا هذا المنتج مناسب لاحتياج محدد داخل روتين العناية.</p>
                </div>
                <div className="grid gap-3">
                  {copy.comparison.map(([label, text], index) => <div key={`${label}-${index}`} className="grid gap-3 rounded-3xl bg-white/8 p-5 sm:grid-cols-[170px_1fr]"><b className="text-[#F8D8D8]">{label}</b><span className="leading-8 text-white/82">{text}</span></div>)}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#F9F0EA] px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-3xl"><p className="text-sm font-black uppercase tracking-[0.32em] text-[#B9827A]">Ritual Timeline</p><h2 className="mt-4 text-4xl font-black text-[#3B2530] sm:text-5xl">ماذا يحدث بعد الطلب؟</h2><p className="mt-4 text-lg leading-9 text-[#6D5960]">توضيح الخطوات بعد الضغط على الزر يقلل القلق ويرفع نسبة إكمال نموذج COD.</p></div>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {copy.timeline.map(([time, text], index) => <div key={time} className="relative rounded-[2rem] bg-white p-6 shadow-sm shadow-rose-950/5"><p className="text-sm font-black text-[#B9827A]">المرحلة {index + 1}</p><h3 className="mt-3 text-3xl font-black text-[#3B2530]">{time}</h3><p className="mt-3 leading-8 text-[#6D5960]">{text}</p></div>)}
              </div>
            </div>
          </section>

          <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
              <div className="rounded-[2rem] bg-[#FFF9F4] p-6">
                <h2 className="text-3xl font-black text-[#3B2530]">معلومات المنتج بوضوح</h2>
                <p className="mt-3 leading-8 text-[#6D5960]">المكونات أو المواصفات وطريقة الاستخدام ترفع الثقة وتقلل شعور العميلة أن المنتج غامض أو مجرد إعلان.</p>
                <div className="mt-6 space-y-3">
                  {selected.ingredients.map((ingredient) => <div key={ingredient.name} className="flex justify-between rounded-2xl bg-white px-5 py-4"><span className="font-bold text-[#6D5960]">{ingredient.name}</span><span className="font-black text-[#5F2E3D]">{ingredient.dose}</span></div>)}
                </div>
              </div>
              <div className="rounded-[2rem] bg-[#3B2530] p-6 text-white">
                <h2 className="text-3xl font-black">لماذا ستشعرين بثقة أكبر قبل الطلب؟</h2>
                <div className="mt-6 space-y-4">
                  {["تبدأ بالمشكلة ثم الوعد ثم الدليل", "تعرض صورا متعددة وليس صورة واحدة", "تستخدم مراجعات طويلة تشبه العميلة الفعلية", "تقدم ضمانا وCOD لتقليل الخوف", "تغلق الاعتراضات قبل نموذج الطلب"].map((item) => <p key={item} className="rounded-2xl bg-white/8 px-5 py-4 font-bold text-white/82">{item}</p>)}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#F9F0EA] px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-3xl"><p className="text-sm font-black uppercase tracking-[0.32em] text-[#B9827A]">Verified Reviews</p><h2 className="mt-4 text-4xl font-black text-[#3B2530] sm:text-5xl">آراء مكتوبة لتبني الثقة لا لتملأ المساحة</h2></div>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {copy.reviews.map(([text, name, city]) => <blockquote key={name} className="rounded-[2rem] bg-white p-6 shadow-sm shadow-rose-950/5"><p className="text-5xl font-black text-[#B9827A]">“</p><p className="mt-3 text-lg leading-9 text-[#6D5960]">{text}</p><footer className="mt-6 font-black text-[#3B2530]">{name}<span className="block text-sm text-[#B9827A]">{city} · مشترية مؤكدة</span></footer></blockquote>)}
              </div>
            </div>
          </section>

          <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.75fr_1.25fr]">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.32em] text-[#B9827A]">أسئلة مهمة</p>
                <h2 className="mt-4 text-4xl font-black text-[#3B2530] sm:text-5xl">قبل أن تطلبي، هذه أكثر الأسئلة شيوعا</h2>
                <p className="mt-4 text-lg leading-9 text-[#6D5960]">السعر، الثقة، التوقعات، طريقة الاستخدام، وما يحدث بعد إرسال الطلب.</p>
              </div>
              <div className="space-y-3">
                {copy.customerQuestions.map(([question, answer]) => <details key={question} className="rounded-3xl bg-[#FFF9F4] p-6"><summary className="cursor-pointer list-none text-xl font-black text-[#3B2530]">{question}</summary><p className="mt-4 leading-8 text-[#6D5960]">{answer}</p></details>)}
              </div>
            </div>
          </section>

          <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.9fr_1.1fr]">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.32em] text-[#B9827A]">عرض اليوم</p>
                <h2 className="mt-4 text-4xl font-black text-[#3B2530] sm:text-5xl">كل ما تحصلين عليه مع طلبك</h2>
                <p className="mt-4 text-lg leading-9 text-[#6D5960]">نستخدم الندرة، تقليل المخاطرة، الضمان، الدفع عند الاستلام، والقيمة المضافة بدون مبالغة أو ادعاءات طبية.</p>
              </div>
              <div className="rounded-[2rem] border border-[#EAD8D2] bg-[#FFF9F4] p-6 shadow-xl shadow-rose-950/8">
                {[[selected.name, money(selected.compareAt)], ["شحن سريع داخل السعودية", money(39)], ["متابعة واتساب للتأكيد", money(49)], ["ضمان رضا 30 يوم", money(59)]].map(([label, value]) => <div key={label} className="flex justify-between border-b border-[#EAD8D2] py-4 last:border-0"><span className="font-bold text-[#6D5960]">{label}</span><span className="font-black text-[#3B2530]">{value}</span></div>)}
                <div className="mt-5 rounded-3xl bg-white p-5"><div className="flex justify-between text-xl font-black"><span>القيمة</span><span className="line-through text-[#B8A3A1]">{money(totalValue)}</span></div><div className="mt-2 flex justify-between text-3xl font-black text-[#5F2E3D]"><span>سعر اليوم</span><span>{money(selected.price)}</span></div></div>
                <button onClick={() => setDrawer("checkout")} className="mt-5 w-full rounded-full bg-[#5F2E3D] py-4 text-lg font-black text-white">أرسلي طلبي بدون دفع الآن</button>
              </div>
            </div>
          </section>

          <section className="bg-[#F9F0EA] px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.75fr_1.25fr]">
              <div><p className="text-sm font-black uppercase tracking-[0.32em] text-[#B9827A]">قبل الشراء</p><h2 className="mt-4 text-4xl font-black text-[#3B2530] sm:text-5xl">إجابات سريعة قبل إرسال الطلب</h2></div>
              <div className="space-y-3">
                {copy.objections.map(([question, answer]) => <details key={question} className="rounded-3xl bg-white p-6"><summary className="cursor-pointer list-none text-xl font-black text-[#3B2530]">{question}</summary><p className="mt-4 leading-8 text-[#6D5960]">{answer}</p></details>)}
              </div>
            </div>
          </section>
        </main>

        <div className="sticky bottom-0 z-30 border-t border-[#EAD8D2] bg-white/95 px-4 py-3 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-black text-[#3B2530]">{selected.name} · {money(selected.price * quantity)} · COD</p>
            <button onClick={() => setDrawer("checkout")} className="rounded-full bg-[#5F2E3D] px-8 py-4 font-black text-white">اطلبي الآن بالدفع عند الاستلام</button>
          </div>
        </div>
      </div>
    );
  }

  function CheckoutDrawer() {
    if (drawer !== "checkout" || !selected) return null;
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-[#3B2530]/55 px-4 py-8 backdrop-blur-sm">
        <form onSubmit={createOrder} className="w-full max-w-2xl rounded-[2rem] bg-[#FFF9F4] p-6 shadow-2xl sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-[#3B2530]">تأكيد الطلب بدون دفع الآن</h2>
              <p className="mt-2 leading-8 text-[#6D5960]">فريقنا يتواصل معك لتأكيد العنوان، والدفع عند الاستلام.</p>
            </div>
            <button type="button" onClick={() => setDrawer("product")} className="rounded-full bg-[#F9F0EA] px-4 py-2 text-xl font-black text-[#5F2E3D]">×</button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="الاسم"><Input name="name" required placeholder="اسمك الكامل" /></Field>
            <Field label="رقم الجوال"><Input name="phone" required placeholder="05xxxxxxxx" /></Field>
            <Field label="المدينة"><Input name="city" required placeholder="الرياض" /></Field>
            <Field label="المنتج"><Input value={`${selected.name} x ${quantity}`} readOnly /></Field>
            <div className="sm:col-span-2"><Field label="العنوان"><TextArea name="address" required placeholder="الحي، الشارع، أقرب معلم" /></Field></div>
          </div>
          <div className="mt-6 rounded-3xl bg-white p-5">
            <div className="flex justify-between text-xl font-black text-[#3B2530]"><span>الإجمالي</span><span>{money(selected.price * quantity)}</span></div>
            <p className="mt-2 text-sm font-bold text-[#6D5960]">الدفع عند الاستلام، نقد أو مدى، وشحن سريع داخل المملكة.</p>
          </div>
          <button className="mt-6 w-full rounded-full bg-[#5F2E3D] py-4 text-lg font-black text-white">إرسال الطلب</button>
        </form>
      </div>
    );
  }

  function AdminPanel() {
    type AdminTab = "overview" | "orders" | "products" | "inventory" | "customers" | "tracking" | "content" | "profit" | "settings";
    const [tab, setTab] = useState<AdminTab>("overview");
    const [query, setQuery] = useState("");
    const [orderQuery, setOrderQuery] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [draft, setDraft] = useState<Product>(() => products[0] ?? blankProduct());
    const confirmedOrders = orders.filter((order) => order.status === "confirmed" || order.status === "shipped");
    const conversionRate = orders.length ? (confirmedOrders.length / orders.length) * 100 : 0;
    const lowStock = products.filter((product) => product.stock <= 10);
    const filteredProducts = products.filter((product) => `${product.name} ${product.sku ?? ""} ${product.category ?? ""}`.toLowerCase().includes(query.toLowerCase()));
    const filteredOrders = orders.filter((order) => `${order.id} ${order.name} ${order.phone} ${order.city}`.toLowerCase().includes(orderQuery.toLowerCase()));
    const customers = Array.from(new Map(orders.map((order) => [order.phone, order])).values());

    function blankProduct(): Product {
      return {
        id: `product-${Date.now()}`,
        name: "منتج جديد",
        subtitle: "عنوان قصير للمنتج",
        problem: "اكتبي هنا المشكلة التي يحلها المنتج والنتيجة المتوقعة للعميلة.",
        image: "https://images.pexels.com/photos/8015898/pexels-photo-8015898.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        images: ["https://images.pexels.com/photos/8015898/pexels-photo-8015898.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
        sku: `NW-${Math.floor(1000 + Math.random() * 9000)}`,
        barcode: "",
        category: "العناية والجمال",
        vendor: "Lamsa Beauty",
        status: "draft",
        price: 129,
        compareAt: 189,
        cost: 45,
        stock: 25,
        weight: 0.18,
        seoTitle: "",
        seoDescription: "",
        bullets: ["ميزة أولى", "ميزة ثانية", "الدفع عند الاستلام", "ضمان رضا"],
        ingredients: [{ name: "Active ingredient", dose: "100 mg" }],
      };
    }

    function startCreateProduct() {
      setDraft(blankProduct());
      setIsCreating(true);
      setTab("products");
    }

    function editProduct(product: Product) {
      setDraft({ ...product, images: product.images?.length ? product.images : [product.image] });
      setIsCreating(false);
      setTab("products");
    }

    async function uploadProductImages(files: FileList | null) {
      if (!files?.length) return;
      const uploaded = await Promise.all(Array.from(files).map(fileToDataUrl));
      setDraft((current) => {
        const images = [...(current.images?.length ? current.images : [current.image]), ...uploaded];
        return { ...current, image: uploaded[0] ?? current.image, images };
      });
    }

    function saveProduct(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const normalized: Product = {
        ...draft,
        image: draft.image || draft.images?.[0] || "https://images.pexels.com/photos/8015898/pexels-photo-8015898.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        images: draft.images?.length ? draft.images : [draft.image || "https://images.pexels.com/photos/8015898/pexels-photo-8015898.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
        bullets: draft.bullets.filter(Boolean),
        ingredients: draft.ingredients.filter((item) => item.name.trim()),
      };
      setProducts((current) => {
        const exists = current.some((product) => product.id === normalized.id);
        return exists ? current.map((product) => (product.id === normalized.id ? normalized : product)) : [normalized, ...current];
      });
      setSelectedId(normalized.id);
      setDraft(normalized);
      setIsCreating(false);
      notify("تم حفظ المنتج وأصبح جاهزا للظهور في المتجر");
    }

    function deleteProduct(productId: string) {
      setProducts((current) => current.filter((product) => product.id !== productId));
      if (selectedId === productId) setSelectedId(products.find((product) => product.id !== productId)?.id ?? "");
      notify("تم حذف المنتج من الكتالوج");
    }

    function exportStoreData() {
      const data = JSON.stringify({ products, orders, tracking, homeCopy }, null, 2);
      navigator.clipboard?.writeText(data);
      notify("تم نسخ نسخة احتياطية JSON إلى الحافظة");
    }

    if (drawer !== "admin") return null;
    return (
      <div className="fixed inset-0 z-50 bg-[#F5F1EC] text-[#1F2933]">
        {!adminUnlocked ? (
          <div className="grid min-h-screen place-items-center px-4">
            <form onSubmit={(event) => { event.preventDefault(); const password = String(new FormData(event.currentTarget).get("password") ?? ""); password === "admin123" ? setAdminUnlocked(true) : notify("كلمة المرور: admin123"); }} className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-950/10">
              <Logo />
              <h2 className="mt-8 text-3xl font-black text-[#111827]">دخول لوحة التحكم</h2>
              <p className="mt-3 leading-7 text-slate-500">لوحة احترافية لإدارة المتجر مثل المنصات الكبيرة: منتجات، صور، طلبات، تتبع، أرباح، وإعدادات النشر.</p>
              <div className="mt-6 grid gap-4">
                <Field label="كلمة المرور"><Input name="password" type="password" placeholder="admin123" /></Field>
                <button className="rounded-2xl bg-[#5F2E3D] px-6 py-4 font-black text-white">دخول</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid h-screen grid-cols-1 overflow-hidden lg:grid-cols-[280px_1fr]">
            <aside className="hidden border-e border-slate-200 bg-[#111827] p-5 text-white lg:block">
              <Logo />
              <div className="mt-8 grid gap-1">
                {[
                  ["overview", "الرئيسية"],
                  ["orders", "الطلبات"],
                  ["products", "المنتجات"],
                  ["inventory", "المخزون"],
                  ["customers", "العملاء"],
                  ["tracking", "التتبع والبيكسلات"],
                  ["content", "واجهة المتجر"],
                  ["profit", "الأرباح"],
                  ["settings", "الإعدادات"],
                ].map(([id, label]) => (
                  <button key={id} onClick={() => setTab(id as AdminTab)} className={`rounded-2xl px-4 py-3 text-start text-sm font-black transition ${tab === id ? "bg-white text-[#111827]" : "text-white/72 hover:bg-white/10 hover:text-white"}`}>{label}</button>
                ))}
              </div>
            </aside>
            <section className="flex min-h-0 flex-col">
              <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-[#B9827A]">Professional Commerce Admin</p>
                    <h2 className="mt-1 text-2xl font-black text-[#111827] sm:text-3xl">لوحة تحكم جاهزة لإدارة ونشر المتجر</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={startCreateProduct} className="rounded-2xl bg-[#5F2E3D] px-5 py-3 text-sm font-black text-white">إضافة منتج</button>
                    <button onClick={exportStoreData} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white">تصدير البيانات</button>
                    <button onClick={() => setDrawer(null)} className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700">عرض المتجر</button>
                  </div>
                </div>
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
                  {[
                    ["overview", "الرئيسية"], ["orders", "الطلبات"], ["products", "المنتجات"], ["inventory", "المخزون"], ["customers", "العملاء"], ["tracking", "التتبع"], ["content", "المحتوى"], ["profit", "الأرباح"], ["settings", "الإعدادات"],
                  ].map(([id, label]) => <button key={id} onClick={() => setTab(id as AdminTab)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${tab === id ? "bg-[#111827] text-white" : "bg-slate-100 text-slate-700"}`}>{label}</button>)}
                </div>
              </header>
              <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                {tab === "overview" && (
                  <div className="grid gap-6">
                    <div className="grid gap-4 md:grid-cols-4">
                      {[["إجمالي المبيعات", money(revenue)], ["الطلبات", String(orders.length)], ["معدل التأكيد", `${conversionRate.toFixed(0)}%`], ["منتجات منخفضة", String(lowStock.length)]].map(([label, value]) => (
                        <div key={label} className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-950/5"><p className="text-sm font-bold text-slate-500">{label}</p><p className="mt-3 text-3xl font-black text-[#111827]">{value}</p></div>
                      ))}
                    </div>
                    <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
                      <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-950/5">
                        <h3 className="text-xl font-black text-[#111827]">آخر الطلبات</h3>
                        <div className="mt-4 space-y-3">
                          {orders.slice(0, 5).map((order) => <div key={order.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"><span><b className="block">{order.name}</b><small className="text-slate-500">{order.productName} - {order.city}</small></span><b>{money(order.total)}</b></div>)}
                          {!orders.length && <p className="rounded-2xl bg-slate-50 p-4 font-bold text-slate-500">لا توجد طلبات بعد.</p>}
                        </div>
                      </div>
                      <div className="rounded-3xl bg-[#111827] p-6 text-white shadow-sm shadow-slate-950/5">
                        <h3 className="text-xl font-black">جاهزية النشر</h3>
                        <div className="mt-5 space-y-4 text-sm font-bold text-white/78">
                          <p>✓ إضافة وتعديل المنتجات</p>
                          <p>✓ رفع صور المنتجات مباشرة</p>
                          <p>✓ إدارة الطلبات وحالات COD</p>
                          <p>✓ إعداد Meta وTikTok وSnap وGA4 وGTM</p>
                          <p>✓ SEO وبيانات المنتج الأساسية</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {tab === "orders" && (
                  <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-950/5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-2xl font-black text-[#111827]">الطلبات</h3>
                      <Input value={orderQuery} onChange={(e) => setOrderQuery(e.target.value)} placeholder="بحث بالاسم أو الجوال أو رقم الطلب" />
                    </div>
                    <div className="mt-5 overflow-x-auto">
                      <table className="w-full min-w-[920px] text-sm">
                        <thead><tr className="border-b border-slate-200 text-start">{["الطلب", "العميلة", "الجوال", "المدينة", "المنتج", "الإجمالي", "الحالة", "واتساب"].map((head) => <th key={head} className="py-3 text-start font-black text-slate-500">{head}</th>)}</tr></thead>
                        <tbody>{filteredOrders.map((order) => <tr key={order.id} className="border-b border-slate-100"><td className="py-4 font-black">{order.id}</td><td>{order.name}</td><td>{order.phone}</td><td>{order.city}</td><td>{order.productName} x {order.quantity}</td><td className="font-black">{money(order.total)}</td><td><Select value={order.status} onChange={(e) => setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: e.target.value as Order['status'] } : item))}><option value="new">جديد</option><option value="confirmed">مؤكد</option><option value="shipped">مشحون</option><option value="cancelled">ملغي</option></Select></td><td><a className="rounded-xl bg-green-50 px-3 py-2 font-black text-green-700" href={`https://wa.me/${order.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`مرحبا ${order.name}، نؤكد طلبك ${order.id} من لمسة بيوتي.`)}`} target="_blank">إرسال</a></td></tr>)}</tbody>
                      </table>
                      {!filteredOrders.length && <p className="mt-5 rounded-2xl bg-slate-50 p-4 font-bold text-slate-500">لا توجد طلبات مطابقة.</p>}
                    </div>
                  </div>
                )}

                {tab === "products" && (
                  <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
                    <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-950/5">
                      <div className="flex items-center justify-between gap-3"><h3 className="text-2xl font-black text-[#111827]">كتالوج المنتجات</h3><button onClick={startCreateProduct} className="rounded-2xl bg-[#5F2E3D] px-4 py-3 text-sm font-black text-white">منتج جديد</button></div>
                      <div className="mt-4"><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث باسم المنتج أو SKU" /></div>
                      <div className="mt-5 space-y-3">
                        {filteredProducts.map((product) => <div key={product.id} className={`flex items-center gap-4 rounded-2xl border p-3 ${draft.id === product.id ? "border-[#5F2E3D] bg-[#F9F0EA]" : "border-slate-100"}`}><button onClick={() => editProduct(product)} className="flex flex-1 items-center gap-4 text-start"><img src={product.image} alt={product.name} className="h-16 w-16 rounded-2xl object-cover" /><span><b className="block text-[#111827]">{product.name}</b><small className="font-bold text-slate-500">{product.sku ?? "بدون SKU"} | {money(product.price)} | مخزون {product.stock}</small></span></button><span className={`rounded-full px-3 py-1 text-xs font-black ${product.status === "draft" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>{product.status === "draft" ? "مسودة" : "نشط"}</span></div>)}
                      </div>
                    </div>
                    <form onSubmit={saveProduct} className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-950/5">
                      <div className="flex items-center justify-between gap-4"><h3 className="text-2xl font-black text-[#111827]">{isCreating ? "إضافة منتج" : "تعديل المنتج"}</h3>{!isCreating && <button type="button" onClick={() => deleteProduct(draft.id)} className="rounded-2xl bg-red-50 px-4 py-2 text-sm font-black text-red-600">حذف</button>}</div>
                      <div className="mt-5 grid gap-5">
                        <section className="rounded-3xl border border-slate-100 p-4"><h4 className="mb-4 font-black text-[#111827]">معلومات المنتج</h4><div className="grid gap-4 sm:grid-cols-2"><Field label="اسم المنتج"><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field><Field label="SKU"><Input value={draft.sku ?? ""} onChange={(e) => setDraft({ ...draft, sku: e.target.value })} /></Field><Field label="التصنيف"><Input value={draft.category ?? ""} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /></Field><Field label="المورد"><Input value={draft.vendor ?? ""} onChange={(e) => setDraft({ ...draft, vendor: e.target.value })} /></Field><div className="sm:col-span-2"><Field label="العنوان المختصر"><Input value={draft.subtitle} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} /></Field></div><div className="sm:col-span-2"><Field label="الوصف"><TextArea value={draft.problem} onChange={(e) => setDraft({ ...draft, problem: e.target.value })} /></Field></div></div></section>
                        <section className="rounded-3xl border border-slate-100 p-4"><h4 className="mb-4 font-black text-[#111827]">صور المنتج</h4><Field label="رفع صور من جهازك"><Input type="file" multiple accept="image/*" onChange={(e) => uploadProductImages(e.target.files)} /></Field><div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">{(draft.images?.length ? draft.images : [draft.image]).filter(Boolean).map((image) => <div key={image} className={`relative overflow-hidden rounded-2xl border-2 ${draft.image === image ? "border-[#5F2E3D]" : "border-transparent"}`}><button type="button" onClick={() => setDraft({ ...draft, image })} className="block w-full"><img src={image} alt="product" className="aspect-square w-full object-cover" /></button><button type="button" onClick={() => setDraft((current) => { const currentImages = (current.images?.length ? current.images : [current.image]).filter(Boolean); const nextImages = currentImages.filter((entry) => entry !== image); const nextMain = current.image === image ? (nextImages[0] ?? "") : current.image; return { ...current, image: nextMain, images: nextImages }; })} className="absolute end-2 top-2 rounded-full bg-white/95 px-2 py-1 text-xs font-black text-red-600 shadow">حذف</button>{draft.image === image && <span className="absolute bottom-2 start-2 rounded-full bg-[#5F2E3D] px-2 py-1 text-[10px] font-black text-white">رئيسية</span>}</div>)}</div><Field label="أو رابط الصورة الرئيسية"><Input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value, images: draft.images?.includes(e.target.value) ? draft.images : [...(draft.images ?? []), e.target.value].filter(Boolean) })} /></Field></section>
                        <section className="rounded-3xl border border-slate-100 p-4"><h4 className="mb-4 font-black text-[#111827]">السعر والمخزون</h4><div className="grid gap-4 sm:grid-cols-4"><Field label="السعر"><Input type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} /></Field><Field label="قبل الخصم"><Input type="number" value={draft.compareAt} onChange={(e) => setDraft({ ...draft, compareAt: Number(e.target.value) })} /></Field><Field label="التكلفة"><Input type="number" value={draft.cost ?? 0} onChange={(e) => setDraft({ ...draft, cost: Number(e.target.value) })} /></Field><Field label="المخزون"><Input type="number" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })} /></Field></div></section>
                        <section className="rounded-3xl border border-slate-100 p-4"><h4 className="mb-4 font-black text-[#111827]">SEO وحالة النشر</h4><div className="grid gap-4 sm:grid-cols-2"><Field label="حالة المنتج"><Select value={draft.status ?? "active"} onChange={(e) => setDraft({ ...draft, status: e.target.value as Product['status'] })}><option value="active">نشط في المتجر</option><option value="draft">مسودة غير منشورة</option></Select></Field><Field label="وزن الشحن KG"><Input type="number" value={draft.weight ?? 0} onChange={(e) => setDraft({ ...draft, weight: Number(e.target.value) })} /></Field><Field label="SEO Title"><Input value={draft.seoTitle ?? ""} onChange={(e) => setDraft({ ...draft, seoTitle: e.target.value })} /></Field><Field label="SEO Description"><Input value={draft.seoDescription ?? ""} onChange={(e) => setDraft({ ...draft, seoDescription: e.target.value })} /></Field></div></section>
                        <section className="rounded-3xl border border-slate-100 p-4"><h4 className="mb-4 font-black text-[#111827]">المزايا والمواصفات</h4><Field label="المزايا، كل سطر ميزة"><TextArea value={draft.bullets.join("\n")} onChange={(e) => setDraft({ ...draft, bullets: e.target.value.split("\n") })} /></Field><Field label="المواصفات بصيغة: الاسم | التفاصيل"><TextArea value={draft.ingredients.map((item) => `${item.name} | ${item.dose}`).join("\n")} onChange={(e) => setDraft({ ...draft, ingredients: e.target.value.split("\n").map((line) => { const [name, dose = ""] = line.split("|"); return { name: name.trim(), dose: dose.trim() }; }) })} /></Field></section>
                        <button className="rounded-2xl bg-[#5F2E3D] px-6 py-4 font-black text-white">حفظ المنتج ونشره</button>
                      </div>
                    </form>
                  </div>
                )}

                {tab === "inventory" && (
                  <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-950/5"><h3 className="text-2xl font-black text-[#111827]">إدارة المخزون</h3><div className="mt-5 grid gap-3">{products.map((product) => <div key={product.id} className="grid gap-3 rounded-2xl border border-slate-100 p-4 sm:grid-cols-[1fr_160px_160px]"><span><b className="block">{product.name}</b><small className="text-slate-500">{product.sku ?? "SKU"}</small></span><Input type="number" value={product.stock} onChange={(e) => setProducts((current) => current.map((item) => item.id === product.id ? { ...item, stock: Number(e.target.value) } : item))} /><span className={`rounded-2xl px-4 py-3 text-center text-sm font-black ${product.stock <= 10 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>{product.stock <= 10 ? "منخفض" : "متوفر"}</span></div>)}</div></div>
                )}

                {tab === "customers" && (
                  <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-950/5"><h3 className="text-2xl font-black text-[#111827]">العملاء</h3><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{customers.map((customer) => { const customerOrders = orders.filter((order) => order.phone === customer.phone); const spend = customerOrders.reduce((sum, order) => sum + order.total, 0); return <div key={customer.phone} className="rounded-2xl border border-slate-100 p-4"><b className="text-lg text-[#111827]">{customer.name}</b><p className="mt-1 text-sm font-bold text-slate-500">{customer.phone} | {customer.city}</p><div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-sm font-black"><span>{customerOrders.length} طلبات</span><span>{money(spend)}</span></div></div>; })}</div>{!customers.length && <p className="mt-5 rounded-2xl bg-slate-50 p-4 font-bold text-slate-500">سيظهر العملاء تلقائيا بعد أول طلب.</p>}</div>
                )}

                {tab === "tracking" && (
                  <div className="grid gap-6 xl:grid-cols-[1fr_.9fr]">
                    <form onSubmit={(event) => { event.preventDefault(); notify("تم حفظ أدوات التتبع"); }} className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-950/5"><h3 className="text-2xl font-black text-[#111827]">أدوات التتبع والبيكسلات</h3><p className="mt-2 leading-7 text-slate-500">أدخل المعرفات التي تحصل عليها من منصات الإعلانات. في نسخة الإنتاج ترسل Events من السيرفر أيضا عبر CAPI.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Meta Pixel ID"><Input value={tracking.metaPixelId} onChange={(e) => setTracking({ ...tracking, metaPixelId: e.target.value })} /></Field><Field label="Meta CAPI Token"><Input value={tracking.metaAccessToken} onChange={(e) => setTracking({ ...tracking, metaAccessToken: e.target.value })} /></Field><Field label="TikTok Pixel ID"><Input value={tracking.tiktokPixelId} onChange={(e) => setTracking({ ...tracking, tiktokPixelId: e.target.value })} /></Field><Field label="TikTok Events API Token"><Input value={tracking.tiktokAccessToken} onChange={(e) => setTracking({ ...tracking, tiktokAccessToken: e.target.value })} /></Field><Field label="Snap Pixel ID"><Input value={tracking.snapchatPixelId} onChange={(e) => setTracking({ ...tracking, snapchatPixelId: e.target.value })} /></Field><Field label="Snap CAPI Token"><Input value={tracking.snapchatAccessToken} onChange={(e) => setTracking({ ...tracking, snapchatAccessToken: e.target.value })} /></Field><Field label="GA4 Measurement ID"><Input value={tracking.ga4MeasurementId} onChange={(e) => setTracking({ ...tracking, ga4MeasurementId: e.target.value })} /></Field><Field label="GTM Container ID"><Input value={tracking.gtmContainerId} onChange={(e) => setTracking({ ...tracking, gtmContainerId: e.target.value })} /></Field></div><button className="mt-5 rounded-2xl bg-[#5F2E3D] px-6 py-4 font-black text-white">حفظ التتبع</button></form>
                    <div className="rounded-3xl bg-[#111827] p-5 text-white shadow-sm shadow-slate-950/5"><h3 className="text-2xl font-black">Event Map</h3><div className="mt-5 space-y-3 text-sm font-bold text-white/78"><p>view_item: عند فتح المنتج</p><p>add_to_cart: عند الضغط على الطلب</p><p>begin_checkout: عند فتح نموذج COD</p><p>purchase: عند إرسال الطلب</p><p>order_confirmed: عند تغيير حالة الطلب إلى مؤكد</p></div><pre className="mt-5 overflow-x-auto rounded-2xl bg-black/25 p-4 text-xs leading-6 text-[#F8D8D8]">{JSON.stringify({ dataLayer: { event: "purchase", currency: "SAR", value: 119, product_id: "glow-serum", order_status: "new" }, tracking }, null, 2)}</pre></div>
                  </div>
                )}

                {tab === "content" && (
                  <form onSubmit={(event) => { event.preventDefault(); notify("تم حفظ واجهة المتجر"); }} className="grid gap-4 rounded-3xl bg-white p-5 shadow-sm shadow-slate-950/5"><h3 className="text-2xl font-black text-[#111827]">واجهة المتجر</h3><Field label="Hero Title"><TextArea value={homeCopy.heroTitle} onChange={(e) => setHomeCopy({ ...homeCopy, heroTitle: e.target.value })} /></Field><Field label="Hero Body"><TextArea value={homeCopy.heroBody} onChange={(e) => setHomeCopy({ ...homeCopy, heroBody: e.target.value })} /></Field><Field label="الشريط العلوي"><Input value={homeCopy.ribbon} onChange={(e) => setHomeCopy({ ...homeCopy, ribbon: e.target.value })} /></Field><button className="rounded-2xl bg-[#5F2E3D] px-6 py-4 font-black text-white">حفظ المحتوى</button></form>
                )}

                {tab === "profit" && <ProfitPanel revenue={revenue} ordersCount={orders.length} />}

                {tab === "settings" && (
                  <div className="grid gap-6 xl:grid-cols-2"><div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-950/5"><h3 className="text-2xl font-black text-[#111827]">إعدادات النشر</h3><div className="mt-5 grid gap-4"><Field label="اسم المتجر"><Input defaultValue={brand.ar} /></Field><Field label="الدومين"><Input defaultValue="lamsabeauty.sa" /></Field><Field label="عملة المتجر"><Select defaultValue="SAR"><option value="SAR">SAR - ريال سعودي</option><option value="AED">AED - درهم إماراتي</option><option value="OMR">OMR - ريال عماني</option></Select></Field><Field label="طريقة الدفع"><Select defaultValue="cod"><option value="cod">الدفع عند الاستلام</option><option value="both">الدفع عند الاستلام والدفع الإلكتروني</option></Select></Field></div></div><div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-950/5"><h3 className="text-2xl font-black text-[#111827]">Checklist قبل الإطلاق</h3><div className="mt-5 space-y-3 text-sm font-bold text-slate-600"><p>✓ أضف صور منتجات حقيقية عالية الجودة</p><p>✓ أدخل بيانات المورد والضمان بوضوح</p><p>✓ اربط الدومين وشركة الشحن</p><p>✓ أدخل Pixel IDs وCAPI Tokens</p><p>✓ اختبر طلب COD كامل من الجوال</p></div></div></div>
                )}
              </main>
            </section>
          </div>
        )}
      </div>
    );
  }

  function ProfitPanel({ revenue, ordersCount }: { revenue: number; ordersCount: number }) {
    const [adSpend, setAdSpend] = useState(950);
    const [productCost, setProductCost] = useState(48);
    const [shipping, setShipping] = useState(18);
    const net = revenue - adSpend - (productCost + shipping) * ordersCount;
    const roas = adSpend ? revenue / adSpend : 0;
    const cpa = ordersCount ? adSpend / ordersCount : 0;
    return (
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-5">
          <h3 className="text-2xl font-black text-[#3B2530]">حاسبة الأرباح</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="تكلفة الإعلان"><Input type="number" value={adSpend} onChange={(e) => setAdSpend(Number(e.target.value))} /></Field>
            <Field label="تكلفة المنتج"><Input type="number" value={productCost} onChange={(e) => setProductCost(Number(e.target.value))} /></Field>
            <Field label="تكلفة الشحن"><Input type="number" value={shipping} onChange={(e) => setShipping(Number(e.target.value))} /></Field>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[["Revenue", money(revenue)], ["CPA", money(cpa)], ["ROAS", `${roas.toFixed(2)}x`], ["Net Profit", money(net)]].map(([label, value]) => <div key={label} className="rounded-[2rem] bg-white p-5"><p className="text-sm font-black text-[#B9827A]">{label}</p><p className="mt-2 text-3xl font-black text-[#3B2530]">{value}</p></div>)}
        </div>
      </div>
    );
  }

  function Footer() {
    return (
      <footer className="bg-[#3B2530] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div><Logo /><p className="mt-5 max-w-md leading-8 text-white/70">متجر عناية وجمال متنوع: بشرة، شعر، جسم، وأدوات جمال، مع شرح واضح، COD، وتجربة شراء سريعة.</p></div>
          <div><h3 className="font-black">الدعم</h3><p className="mt-4 leading-8 text-white/70">واتساب: 05xxxxxxxx<br />الإيميل: care@lamsabeauty.sa</p></div>
          <div><h3 className="font-black">الثقة</h3><p className="mt-4 leading-8 text-white/70">منتجات مختارة<br />دفع عند الاستلام<br />ضمان رضا 30 يوم</p></div>
        </div>
      </footer>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F4] text-[#3B2530]">
      <Header />
      <Hero />
      <ProductsSection />
      <WhySection />
      <ReviewsSection />
      <HowItWorks />
      <CtaFaq />
      <Footer />
      <ProductDrawer />
      <CheckoutDrawer />
      <AdminPanel />
      {toast && <div className="fixed left-1/2 top-24 z-[70] -translate-x-1/2 rounded-full bg-[#5F2E3D] px-6 py-3 text-sm font-black text-white shadow-xl">{toast}</div>}
    </div>
  );
}