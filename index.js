// AFGHAN BEAUTY Store Core Logic

// Redirect API requests based on settings or protocol fallback
(function() {
  const getSetting = (key) => (window.STORE_SETTINGS && window.STORE_SETTINGS[key]) || '';
  const apiBase = getSetting('api_base_url') || (window.location.protocol === 'file:' ? 'http://localhost:8080' : '');
  
  if (apiBase) {
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      if (typeof input === 'string' && input.startsWith('/api/')) {
        input = apiBase.replace(/\/$/, '') + input;
      }
      return originalFetch(input, init);
    };
  }
})();

// =====================================================
// IMAGE HELPER — fixes GitHub Pages broken images
// =====================================================
// Compute base path for GitHub Pages compatibility
// On GitHub Pages the site lives at /repo-name/ so we need to prepend the base path
const BASE_PATH = (function() {
  const baseEl = document.querySelector('base[href]');
  if (baseEl) return baseEl.href.replace(/\/$/, '') + '/';
  const path = window.location.pathname;
  var dir = path.substring(0, path.lastIndexOf('/') + 1);
  if (!path.endsWith('/') && !path.split('/').pop().includes('.')) {
    dir = path + '/';
  }
  return dir;
})();

const PRODUCT_IMG = BASE_PATH + 'assets/afghan-oil.png';
const AVATAR_IMG  = BASE_PATH + 'assets/store-avatar.png';

// Try to load stored logo URL from admin
function getProductImage(productId) {
  try {
    const stored = localStorage.getItem('afghanbeauty_products_config');
    if (stored) {
      const prods = JSON.parse(stored);
      if (prods[productId] && prods[productId].image) return resolveImagePath(prods[productId].image);
    }
  } catch(e) {}
  // fallback
  const defaults = { 1: PRODUCT_IMG, 2: PRODUCT_IMG, 3: PRODUCT_IMG };
  return defaults[productId] || PRODUCT_IMG;
}

// Resolve relative image paths to work on GitHub Pages subdirectory deployments and local servers
function resolveImagePath(imgPath) {
  if (!imgPath) return PRODUCT_IMG;
  // Clean Windows paths or absolute system paths
  if (imgPath.includes(':\\') || imgPath.includes(':/') || imgPath.startsWith('file:///')) {
    // Extract relative part after 'assets/'
    const match = imgPath.match(/assets[/\\][^/\\]+$/);
    if (match) {
      imgPath = match[0];
    } else {
      // If assets not found, extract filename
      const parts = imgPath.split(/[/\\]/);
      const filename = parts[parts.length - 1];
      imgPath = 'assets/' + filename;
    }
  }
  // Replace backslashes with forward slashes
  imgPath = imgPath.replace(/\\/g, '/');
  
  // Already absolute URL (http/https/data URI) — leave as-is
  if (/^(https?:\/\/|data:)/.test(imgPath)) return imgPath;
  // Already starts with BASE_PATH — leave as-is
  if (BASE_PATH && imgPath.startsWith(BASE_PATH)) return imgPath;
  // Strip leading "./" or "/" if present
  imgPath = imgPath.replace(/^\.?\//, '');
  return BASE_PATH + imgPath;
}

// Default skincare products database
const defaultProducts = {
  1: {
    id: 1,
    name: 'زيت الأفغاني الأصلي الذهبي (Golden Afghan Oil)',
    subtitle: 'التركيبة التقليدية المعززة بالزيوت الطبيعية لإنبات وتكثيف الشعر ومنع التساقط',
    price: 129,
    oldPrice: 249,
    qty: 1,
    unit: '250 مل',
    status: 'active',
    freeShipping: false,
    image: 'assets/afghan-oil.png',
    desc_title: 'ما الذي يميز زيت الأفغاني الأصلي الذهبي؟',
    desc_body: 'مستخلص من أجود بذور نبتة القنب الطبيعية، معزز بـ 7 زيوت عشبية شرقية مركزة. يعمل على اختراق الفروة مباشرة لتنشيط البصيلات الخاملة، إيقاف التساقط نهائياً، وتعبئة الفراغات للرجال والنساء بطريقة طبيعية آمنة تماماً وخالية من المينوكسيديل.',
    desc_bullets: '✦ يوقف تساقط الشعر بنسبة 95% خلال الأسبوعين الأولين من الاستخدام\n✦ ينبت الشعر في الفراغات والصلع غير الوراثي ويعيد ملء خط الشعر\n✦ يزيد طول الشعر بشكل ملحوظ بمعدل 3-5 سم شهرياً\n✦ يغذي الفروة ويقضي على القشرة والجفاف المسبب لضعف البصيلات\n✦ طبيعي 100% وخالٍ من المينوكسيديل أو أي مواد كيميائية ضارة',
    target_title: 'لمن هو مناسب؟',
    target_list: '✔ النساء اللواتي يعانين من تساقط الشعر الشديد والتلف الناتج عن مياه الإمارات الكلسية (Hard Water).\n✔ الرجال الذين يعانون من الفراغات وتراجع خط الشعر أو ضعف اللحية.\n✔ أصحاب الشعر الباهت والجاف الذي يحتاج إلى لمعان ونعومة فائقة.\n✔ الأطفال فوق سن 3 سنوات لتكثيف وتنعيم الشعر بأمان تام.',
    howto_1_title: 'توزيع قطرات مناسبة على الفروة',
    howto_1_desc: 'ضعي كمية كافية من الزيت على فروة رأس جافة أو رطبة مع التركيز على مناطق الفراغات والتساقط.',
    howto_2_title: 'التدليك اللطيف بأطراف الأصابع',
    howto_2_desc: 'دلكي الفروة بحركات دائرية هادئة لمدة 5 دقائق لتنشيط الدورة الدموية ومساعدة البصيلات على الامتصاص.',
    howto_3_title: 'الترك والغسيل بالشامبو',
    howto_3_desc: 'اتركي الزيت على الشعر لمدة 2 إلى 3 ساعات، ثم اغسليه جيداً باستخدام شامبو الأفغاني الأصلي المطور.',
    faq_1_q: 'هل زيت الأفغاني الأصلي مناسب لجميع أنواع الشعر؟',
    faq_1_a: 'نعم، زيت الأفغاني الأصلي هو منتج طبيعي 100% يناسب جميع أنواع الشعر (الجاف، الدهني، المصبوغ، والعادي) واللحية. تركيبته متوازنة لتغذية بصيلات الشعر دون سد مسام فروة الرأس.',
    faq_2_q: 'متى تظهر نتائج إنبات وتكثيف الشعر؟',
    faq_2_a: 'تلاحظ معظم العميلات والعملاء توقفاً ملحوظاً في تساقط الشعر وزيادة في النعومة خلال أول 10 إلى 14 يوماً. أما بالنسبة لإنبات الفراغات وتكثيف الشعر واللحية بشكل كامل، تظهر النتائج الواضحة خلال 4 إلى 8 أسابيع من الاستخدام المنتظم.',
    faq_3_q: 'هل يعود الشعر للتساقط بعد التوقف عن استخدام الزيت؟',
    faq_3_a: 'لا، لأن زيت الأفغاني الذهبي يغذي البصيلات ويعالج مشاكل الشعر من الجذور بطريقة طبيعية وخالٍ تماماً من المينوكسيديل. عندما تصل للنتيجة المطلوبة وتتوقف عن الاستخدام، لن يتساقط شعرك طالما تحافظ على روتين تغذية صحي وتتجنب العوامل الضارة.',
    faq_4_q: 'كيف أضمن أن الزيت أصلي وليس مقلداً؟',
    faq_4_a: 'منتجنا هو زيت الأفغاني الأصلي السعودي المرخص والمطابق للمواصفات، ويأتي بختم الضمان الذهبي والعلامة المائية الموثقة. كما نقدم ضماناً ذهبياً: إن لم تلاحظ أي نتائج ملموسة خلال 30 يوماً، يمكنك استرجاع أموالك بالكامل.',
    faq_5_q: 'ما هي طريقة الاستخدام المثالية للشعر واللحية؟',
    faq_5_a: 'للشعر: توضع قطرات مناسبة على الفروة مع التدليك لمدة 5 دقائق، ويترك من 2 إلى 3 ساعات ثم يغسل بشامبو الأفغاني الأصلي. يستخدم 3 مرات أسبوعياً. للحية: توضع قطرات بسيطة يومياً على الفراغات مع تدليك خفيف مساءً ولا داعي لغسله فوراً لسرعة امتصاصه الفائقة.',
    gallery_tube: 'assets/afghan-oil.png',
    gallery_texture: '',
    gallery_formula: '',
    guide_step_1: 'assets/guide-step-1.png',
    guide_step_2: 'assets/guide-step-2.png',
    guide_step_3: 'assets/guide-step-3.png'
  },
  2: {
    id: 2,
    name: 'شامبو الأفغاني الأصلي المنشط (Afghan Shampoo)',
    subtitle: 'الشامبو العشبي الخالي من السلفات والبارابين لتنظيف الفروة وتنشيط الجذور',
    price: 99,
    oldPrice: 149,
    qty: 1,
    unit: '300 مل',
    status: 'active',
    freeShipping: false,
    image: 'assets/afghan-oil.png',
    desc_title: 'لماذا شامبو الأفغاني الأصلي؟',
    desc_body: 'تركيبة عشبية مطهرة مدعمة بخلاصة الثوم الأسود والبروتين المغذي. يطهر الفروة من الرواسب والدهون دون تجفيفها، مما يمهد الطريق لامتصاص مثالي لزيت الأفغاني وزيادة سرعة الإنبات.',
    desc_bullets: '✦ ينظف الفروة بعمق ويزيل القشرة والدهون المتراكمة التي تسد البصيلات\n✦ خالٍ تماماً من السلفات والسيليكون والبارابين لتجنب إجهاد الشعر والتلف\n✦ مدعم بالبيوتين والكيراتين لتقوية جذع الشعرة وحمايتها من التكسر\n✦ يزيد من كفاءة امتصاص الفروة لزيت الأفغاني بنسبة 200%\n✦ يمنح الشعر رائحة عشبية منعشة ولمعاناً طبيعياً ساحراً',
    target_title: 'لمن هو مناسب هذا الشامبو؟',
    target_list: '✔ من يعانون من قشرة الرأس والدهون الزائدة التي تخنق البصيلات.\n✔ أصحاب الشعر التالف والمصبوغ الذي يحتاج لشامبو خالي من المواد الكيميائية القاسية.\n✔ كخطوة أساسية مطهرة قبل تطبيق زيت الأفغاني الأصلي لضمان الامتصاص.\n✔ الفروة الحساسة المعرضة للتهيج والحكة.',
    howto_1_title: 'تطبيق الشامبو على شعر مبلل',
    howto_1_desc: 'ضعي كمية مناسبة من الشامبو على شعر وفروة رأس مبللة بالكامل.',
    howto_2_title: 'تدليك الفروة بلطف',
    howto_2_desc: 'دلكي الفروة بأطراف أصابعك بلطف لمدة دقيقتين لإنتاج رغوة غنية وتنظيف المسام.',
    howto_3_title: 'الشطف الكامل بالماء',
    howto_3_desc: 'اشطفي شعرك جيداً بماء فاتر لضمان إزالة أي بقايا للشامبو، ثم جففيه برفق.',
    faq_1_q: 'هل يمكن استخدامه للشعر المصبوغ؟',
    faq_1_a: 'نعم، شامبو الأفغاني خالٍ تماماً من السلفات والكلوريد والبارابين، وهي المواد التي تسبب بهتان صبغة الشعر، لذا فهو آمن تماماً للشعر المعالج بالبروتين والمصبوغ.',
    faq_2_q: 'هل يحتوي على روائح عطور قوية؟',
    faq_2_a: 'لا، يتميز الشامبو برائحة عشبية خفيفة وطبيعية تماماً مستخلصة من المكونات النباتية، وتختفي الرائحة تماماً بعد شطف الشعر بالماء.',
    faq_3_q: 'كم مرة يجب استخدامه في الأسبوع؟',
    faq_3_a: 'يُفضل استخدامه من 2 إلى 3 مرات أسبوعياً بالتزامن مع روتين تطبيق زيت الأفغاني الأصلي للحصول على فروة نظيفة وبصيلات مستعدة للامتصاص.',
    faq_4_q: 'هل يحتوي على مستخلص الثوم الفعلي؟',
    faq_4_a: 'نعم، يحتوي على خلاصة الثوم الأسود المخمر الغني بالبروتينات ومضادات الأكسدة التي تقوي جذور الشعر وتمنع تساقطه دون ترك أي رائحة غير مرغوبة.',
    faq_5_q: 'ما هي بلد الصنع للمنتج؟',
    faq_5_a: 'المنتج مصنع ومرخص في المملكة العربية السعودية بموجب أعلى المعايير الصحية ومطابق للمواصفات الإماراتية المعتمدة لاستيراد مستحضرات التجميل.',
    gallery_tube: 'assets/afghan-oil.png',
    gallery_texture: '',
    gallery_formula: ''
  },
  3: {
    id: 3,
    name: 'سيروم الفراغات المكثف للحية والشارب (Beard Serum)',
    subtitle: 'السيروم المركز لإنبات شعر الوجه وتعبئة فراغات الذقن والشارب للرجال',
    price: 129,
    oldPrice: 199,
    qty: 1,
    unit: '60 مل',
    status: 'active',
    freeShipping: false,
    image: 'assets/afghan-oil.png',
    desc_title: 'لماذا سيروم اللحية والشارب المكثف؟',
    desc_body: 'تركيبة خفيفة وسريعة الامتصاص مخصصة لشعر الوجه للرجال. يدمج زيت الأفغاني المركز مع مستخلص الجينسينغ وزيت الأركان لتنشيط الدورة الدموية في الخدين وتعبئة فراغات اللحية والشارب بفعالية وسرعة.',
    desc_bullets: '✦ يعالج فراغات اللحية والشارب الناتجة عن ضعف البصيلات أو قلة النمو\n✦ يسرع نمو شعر الوجه ويزيد من سماكته وخشونته الذكورية الجذابة\n✦ قوام خفيف جداً يمتص خلال ثوانٍ ولا يترك أي ملمس دهني أو لمعة مزعجة\n✦ يرطب بشرة الوجه ويمنع الحكة والتقشر المصاحب لنمو اللحية\n✦ يحفز البصيلات النائمة لإنبات شعر جديد وقوي وبشكل متناسق',
    target_title: 'لمن يوصى باستخدام السيروم؟',
    target_list: '✔ الرجال الذين يعانون من فراغات غير منتظمة في اللحية والشارب.\n✔ أصحاب اللحية الضعيفة أو بطيئة النمو التي تحتاج لتسريع وتكثيف.\n✔ من يبحث عن مرطب ومنعم يومي لشعر اللحية يقضي على الحكة والقشرة.\n✔ الشباب الراغبين في تنشيط نمو شعر الوجه لأول مرة بشكل متناسق.',
    howto_1_title: 'تنظيف الوجه بالماء الدافئ',
    howto_1_desc: 'اغسل ذقنك ووجهك بماء دافئ لفتح المسام وتنشيط الجلد قبل الاستخدام.',
    howto_2_title: 'توزيع قطرات بسيطة',
    howto_2_desc: 'ضع 3 إلى 5 قطرات على راحة يدك ووزعها بالتساوي على مناطق الفراغات والشعر في اللحية.',
    howto_3_title: 'التدليك الخفيف بأطراف الأصابع',
    howto_3_desc: 'دلك بشرة الوجه تحت اللحية بلطف بحركات دائرية لمدة دقيقة. لا داعي لغسله لسرعة امتصاصه الفائقة.',
    faq_1_q: 'هل يسبب حساسية لبشرة الوجه؟',
    faq_1_a: 'السيروم مصمم بزيوت طبيعية لطيفة جداً مثل الأركان ومستخلص الجينسينغ. إذا كانت بشرتك شديدة الحساسية، ننصح بتجربة قطرة واحدة على جزء صغير من الرقبة والانتظار 24 ساعة.',
    faq_2_q: 'هل يترك أثراً دهنياً أو لمعة؟',
    faq_2_a: 'لا، السيروم خفيف للغاية وسريع الامتصاص مقارنة بالزيوت التقليدية، مما يجعله مثالياً للاستخدام اليومي والخروج دون أي لمعان دهني أو ملمس لزج.',
    faq_3_q: 'متى تظهر نتائج تعبئة فراغات اللحية؟',
    faq_3_a: 'تبدأ البصيلات الخاملة بالاستجابة خلال 3 إلى 4 أسابيع من الاستخدام اليومي المستمر، وتلاحظ زيادة في طول وسماكة اللحية وامتلاء الفراغات في غضون 6 إلى 8 أسابيع.',
    faq_4_q: 'هل يمكن استخدامه للشارب أيضاً؟',
    faq_4_a: 'بالتأكيد، السيروم آمن وفعال للاستخدام على جميع مناطق نمو شعر الوجه بما في ذلك الشارب والذقن والخدين والسوالف.',
    faq_5_q: 'هل المنتج يحتوي على مواد هرمونية؟',
    faq_5_a: 'لا، السيروم خفيف وطبيعي 100% ويعتمد بالكامل على مستخلصات النباتات والزيوت الطبيعية التي تحفز البصيلات بشكل فيزيولوجي آمن دون التأثير على الهرمونات.',
    gallery_tube: 'assets/afghan-oil.png',
    gallery_texture: '',
    gallery_formula: ''
  }
};

let products = {};

async function loadProductsFromServer() {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      products = await res.json();
      return;
    }
  } catch (e) {
    console.warn("Failed to load products from server, falling back:", e);
  }
}

function initProductsCatalog() {
  if (Object.keys(products).length > 0) return;
  try {
    const stored = localStorage.getItem('afghanbeauty_products_config');
    if (stored) {
      products = JSON.parse(stored);
      // Reset if it doesn't match the new Afghan products catalog
      if (!products[1] || !products[1].name.includes('الأفغاني') || !products[2] || !products[2].name.includes('شامبو')) {
        products = JSON.parse(JSON.stringify(defaultProducts));
        localStorage.setItem('afghanbeauty_products_config', JSON.stringify(products));
      } else if (!products[1].guide_step_1) {
        // Self-healing database migration for step images
        products[1].guide_step_1 = 'assets/guide-step-1.png';
        products[1].guide_step_2 = 'assets/guide-step-2.png';
        products[1].guide_step_3 = 'assets/guide-step-3.png';
        localStorage.setItem('afghanbeauty_products_config', JSON.stringify(products));
      }
    } else {
      products = JSON.parse(JSON.stringify(defaultProducts));
      localStorage.setItem('afghanbeauty_products_config', JSON.stringify(products));
    }
  } catch(e) {
    products = JSON.parse(JSON.stringify(defaultProducts));
  }
}

// Backward-compatible bundle mapping structure
const bundles = {};
window.bundles = bundles;

function updateBundlesLegacyMap(prod) {
  if (prod.id == 1) {
    bundles[1] = { id: 1, name: `عبوة + الثانية بـ 1 درهم — ${prod.name}`, price: prod.price, quantity: 2, theme: 'lime' };
    bundles[2] = { id: 2, name: `عبوتين + عبوة مجانية — ${prod.name}`, price: 189, quantity: 3, theme: 'lime' };
    bundles[3] = { id: 3, name: `3 عبوات + عبوة مجانية — ${prod.name}`, price: 237, quantity: 4, theme: 'lime' };
  } else {
    bundles[1] = { id: 1, name: `عبوة واحدة — ${prod.name}`, price: prod.price, quantity: 1, theme: 'lime' };
    bundles[2] = { id: 2, name: `عبوتين (توفير 15%) — ${prod.name}`, price: Math.round(prod.price * 2 * 0.85), quantity: 2, theme: 'lime' };
    bundles[3] = { id: 3, name: `3 عبوات (توفير 25%) — ${prod.name}`, price: Math.round(prod.price * 3 * 0.75), quantity: 3, theme: 'lime' };
  }
}

// Dynamic Catalog Renderer for index.html
function renderCatalogGrid() {
  const grid = document.getElementById('index-products-grid');
  if (!grid) return;

  grid.innerHTML = '';
  
  Object.values(products).forEach(p => {
    if (p.status !== 'active') return;
    
    const savePct = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    
    const resolvedImg = resolveImagePath(p.image || 'assets/afghan-oil.png');
    const visualHTML = `<img src="${resolvedImg}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain;display:block;margin:auto;border-radius:10px;">`;

    const card = document.createElement('div');
    card.className = `bundle-card ${p.id == 2 ? 'popular' : ''}`;
    card.setAttribute('data-bundle-id', p.id);
    
    card.innerHTML = `
      ${p.id == 2 ? '<span class="bundle-popular-badge">الأكثر طلباً وتوفيراً</span>' : ''}
      <div class="bundle-visual-container" style="display:flex;justify-content:center;margin-bottom:1.25rem;background:radial-gradient(circle at 50% 30%,#faf6eb,#ebdcb9);border-radius:20px;padding:2rem 1.5rem;height:240px;align-items:center;justify-content:center;overflow:hidden;">
        <div style="position:relative;height:200px;display:flex;align-items:center;justify-content:center;width:100%;">
          ${visualHTML}
        </div>
      </div>
      <div class="bundle-header">
        <h3 class="bundle-title" style="font-size:1.15rem;font-weight:800;margin-bottom:0.25rem;">${p.name}</h3>
        <span class="bundle-subtitle" style="font-size:0.8rem;color:var(--text-muted);display:block;height:2.4rem;overflow:hidden;text-overflow:ellipsis;">${p.subtitle || 'العناية الفائقة بالبشرة'}</span>
      </div>
      <div class="bundle-price-wrap" style="margin:1rem 0;display:flex;align-items:baseline;gap:0.5rem;flex-wrap:wrap;">
        <span class="bundle-price-current" style="font-size:1.6rem;font-weight:900;color:var(--primary);">${p.price} <span style="font-size:0.8rem;">د.إ</span></span>
        ${p.oldPrice ? `<span class="bundle-price-old" style="text-decoration:line-through;color:var(--text-muted);font-size:0.85rem;">${p.oldPrice} د.إ</span>` : ''}
        ${savePct > 0 ? `<span class="bundle-save-badge" style="background:var(--primary);color:var(--bg-dark);font-size:0.65rem;font-weight:900;padding:0.15rem 0.4rem;border-radius:50px;">خصم ${savePct}%</span>` : ''}
      </div>
      <div class="bundle-benefits" style="margin-bottom:1.5rem;font-size:0.82rem;color:var(--text-muted);text-align:right;">
        <div class="bundle-benefit-item" style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.4rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5" style="width:14px;height:14px;"><polyline points="20 6 9 17 4 12"/></svg>
          <span>الحجم: ${p.unit || 'حجم قياسي'}</span>
        </div>
        <div class="bundle-benefit-item" style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.4rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5" style="width:14px;height:14px;"><polyline points="20 6 9 17 4 12"/></svg>
          <span>شحن مبرد سريع للمنزل ❄️</span>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <button class="btn btn-secondary" style="width:100%;" onclick="event.stopPropagation(); addProductToCart(${p.id}, 1)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:0.25rem;"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          أضيفي للسلة
        </button>
        <a href="product.html?id=${p.id}" class="btn btn-primary" style="width:100%;text-align:center;text-decoration:none;" onclick="event.stopPropagation();">تفاصيل المنتج</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

function applyDynamicPrices() {
  try {
    initProductsCatalog();
    
    const pathname = window.location.pathname;
    if (pathname.includes('product.html')) {
      loadProductDetails();
    } else if (pathname.includes('landing.html')) {
      loadLandingPageCheckout();
    } else {
      renderCatalogGrid();
    }
  } catch(e) {
    console.warn('applyDynamicPrices error:', e);
  }
}

// Shopping Cart State (holds selected bundles)
let cart = [];

// Initialize LocalStorage Cart
if (localStorage.getItem('afghanbeauty_cart')) {
  try {
    cart = JSON.parse(localStorage.getItem('afghanbeauty_cart'));
  } catch (e) {
    cart = [];
  }
}

// ----------------------------------------------------
// UI Logic & Setup
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', async () => {
  // Pre-load products from server
  await loadProductsFromServer();

  // Migrate store name in localStorage if it has the old name
  try {
    const langKey = 'afghanbeauty_lang_content';
    let langContent = localStorage.getItem(langKey);
    if (langContent) {
      if (langContent.includes('كوريان بيوتي') || langContent.includes('KOREAN BEAUTY') || langContent.includes('koreanbeauty.shop')) {
        langContent = langContent
          .replace(/كوريان بيوتي/g, 'أفغاني بيوتي')
          .replace(/KOREAN BEAUTY/g, 'AFGHAN BEAUTY')
          .replace(/koreanbeauty\.shop/g, 'afghanbeauty.shop')
          .replace(/koreanbeauty\.ksa/g, 'afghanbeauty.ae');
        localStorage.setItem(langKey, langContent);
      }
    }
  } catch(e) {}

  // Fix all static image paths in HTML for GitHub Pages compatibility
  fixStaticImagePaths();
  applyDynamicLogo();
  applyDynamicGuideSteps();
  initAnnouncementBar();
  initMobileMenu();
  renderCart();
  updateCartBadge();
  setupEventListeners();
  initBundleCountdown();
  initStockPulse();
  applyDynamicPrices();
});

// Fix static img src attributes in HTML that use relative 'assets/' paths
function fixStaticImagePaths() {
  document.querySelectorAll('img[src^="assets/"]').forEach(img => {
    img.src = resolveImagePath(img.getAttribute('src'));
  });
}

// Load dynamic guide steps and images from admin settings
function applyDynamicGuideSteps() {
  try {
    initProductsCatalog();
    const p = products[1]; // Product 1 is the main product
    if (!p) return;
    
    // Select the steps grid
    const stepsGrid = document.querySelector('.guide-steps-grid');
    if (!stepsGrid) return;
    
    // We have 3 steps
    const cards = stepsGrid.querySelectorAll('.guide-step-card');
    if (cards.length >= 3) {
      for (let i = 1; i <= 3; i++) {
        const card = cards[i - 1];
        
        // Update image
        const img = card.querySelector('.guide-step-img');
        const customImg = p[`guide_step_${i}`];
        if (img && customImg) {
          img.src = resolveImagePath(customImg);
        }
        
        // Update title
        const title = card.querySelector('.guide-step-card-title');
        const customTitle = p[`howto_${i}_title`];
        if (title && customTitle) {
          title.textContent = customTitle;
        }
        
        // Update description
        const desc = card.querySelector('.guide-step-card-desc');
        const customDesc = p[`howto_${i}_desc`];
        if (desc && customDesc) {
          if (customDesc.includes('<strong>') || customDesc.includes('<b>')) {
            desc.innerHTML = customDesc;
          } else {
            let formattedDesc = customDesc;
            formattedDesc = formattedDesc.replace(/(للشعر:|للهاتف:|للحية:)/g, '<strong>$1</strong>');
            desc.innerHTML = formattedDesc;
          }
        }
      }
    }
  } catch(e) {
    console.warn('applyDynamicGuideSteps error:', e);
  }
}

// Apply dynamic store logo if customized in admin panel
function applyDynamicLogo() {
  try {
    const customLogo = localStorage.getItem('afghanbeauty_store_logo');
    if (!customLogo) return;

    const logos = document.querySelectorAll('.logo-icon img, .sidebar-logo img, .avatar-btn img');
    logos.forEach(img => {
      img.src = customLogo;
    });

    const favicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
    favicons.forEach(link => {
      link.href = customLogo;
    });
  } catch(e) {
    console.warn('applyDynamicLogo error:', e);
  }
}

// Bundle Countdown Timer
function initBundleCountdown() {
  const el = document.getElementById('bundleCountdown');
  if (!el) return;

  let endTime = sessionStorage.getItem('afghanbeauty_offer_end');
  if (!endTime) {
    endTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    sessionStorage.setItem('afghanbeauty_offer_end', endTime);
  }
  endTime = parseInt(endTime);

  function tick() {
    const remaining = endTime - Date.now();
    if (remaining <= 0) {
      el.textContent = '00:00:00';
      return;
    }
    const h = Math.floor(remaining / 3600000).toString().padStart(2, '0');
    const m = Math.floor((remaining % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((remaining % 60000) / 1000).toString().padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
}

// Stock count random drift (social proof)
function initStockPulse() {
  const el = document.getElementById('stockCount');
  if (!el) return;
  let stock = parseInt(sessionStorage.getItem('afghanbeauty_stock') || '23');

  setInterval(() => {
    if (Math.random() < 0.3 && stock > 8) {
      stock--;
      sessionStorage.setItem('afghanbeauty_stock', stock);
      el.textContent = stock;
      el.style.color = stock < 12 ? '#ef4444' : 'var(--primary)';
    }
  }, 25000);
}

// Announcement Bar Slider
function initAnnouncementBar() {
  const announcements = document.querySelectorAll('.announcement-item');
  let currentIndex = 0;
  
  if (announcements.length > 0) {
    setInterval(() => {
      announcements[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % announcements.length;
      announcements[currentIndex].classList.add('active');
    }, 4000);
  }
}

// Mobile Menu Toggle
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }
}

function closeMobileMenu() {
  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav) mobileNav.classList.remove('open');
}

// Setup global DOM events
function setupEventListeners() {
  const openCartBtn = document.getElementById('openCartBtn');
  if (openCartBtn) openCartBtn.addEventListener('click', openCartDrawer);
  
  const closeCartBtn = document.getElementById('closeCartBtn');
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  
  const cartOverlay = document.getElementById('cartOverlay');
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target.id === 'cartOverlay') closeCartDrawer();
    });
  }

  const cardNumber = document.getElementById('cardNumber') || document.getElementById('lp-card');
  const cardExpiry = document.getElementById('cardExpiry') || document.getElementById('lp-expiry');
  const cardCvv = document.getElementById('cardCvv') || document.getElementById('lp-cvv');

  if (cardNumber) {
    cardNumber.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let matches = value.match(/\d{4,16}/g);
      let match = (matches && matches[0]) || '';
      let parts = [];
      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }
      if (parts.length > 0) {
        e.target.value = parts.join(' ');
      } else {
        e.target.value = value;
      }
    });
  }

  if (cardExpiry) {
    cardExpiry.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (value.length >= 2) {
        let month = parseInt(value.substring(0, 2));
        if (month > 12) month = 12;
        if (month < 1) month = 1;
        let formattedMonth = month < 10 ? '0' + month : month;
        e.target.value = formattedMonth + (value.length > 2 ? '/' + value.substring(2, 4) : '');
      } else {
        e.target.value = value;
      }
    });
  }

  if (cardCvv) {
    cardCvv.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
  }
}

// ----------------------------------------------------
// Cart Core Operations
// ----------------------------------------------------

function saveCart() {
  localStorage.setItem('afghanbeauty_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  if (badge) {
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalQty;
  }
}

// Helper to calculate unit price based on product ID and quantity (e.g. quantity discounts)
function getUnitPrice(prodId, qty) {
  if (prodId == 1) {
    if (qty === 2) return 94.5; // 189 / 2
    if (qty >= 3) return 79;    // 237 / 3
    return 129;
  }
  const p = products[prodId] || defaultProducts[prodId];
  if (!p) return 99;
  if (qty === 2) return Math.round(p.price * 0.85);
  if (qty >= 3) return Math.round(p.price * 0.75);
  return p.price;
}

// Add arbitrary product to cart
function addProductToCart(prodId, quantity = 1) {
  initProductsCatalog();
  const p = products[prodId] || defaultProducts[prodId];
  if (!p) return;

  const existingIdx = cart.findIndex(item => item.id == prodId);
  if (existingIdx !== -1) {
    const newQty = cart[existingIdx].quantity + quantity;
    cart[existingIdx].quantity = newQty;
    cart[existingIdx].price = getUnitPrice(prodId, newQty);
  } else {
    cart.push({
      id: prodId,
      name: p.name,
      price: getUnitPrice(prodId, quantity),
      quantity: quantity,
      image: resolveImagePath(p.image || 'assets/afghan-oil.png')
    });
  }

  saveCart();
  renderCart();
  openCartDrawer();

  // Firing AddToCart event
  if (typeof window.trackPixelEvent === 'function') {
    window.trackPixelEvent('AddToCart', {
      value: getUnitPrice(prodId, quantity) * quantity,
      currency: 'AED',
      content_name: p.name,
      content_type: 'product',
      content_ids: ['AFG_OIL_QTY_' + quantity],
      num_items: quantity
    });
  }
}

// Quantity discount adder for product page
function addProductToCartWithQtyDiscount(prodId, qty) {
  initProductsCatalog();
  const p = products[prodId] || defaultProducts[prodId];
  if (!p) return;

  const existingIdx = cart.findIndex(item => item.id == prodId);
  if (existingIdx !== -1) {
    const newQty = cart[existingIdx].quantity + qty;
    cart[existingIdx].quantity = newQty;
    cart[existingIdx].price = getUnitPrice(prodId, newQty);
  } else {
    cart.push({
      id: prodId,
      name: p.name,
      price: getUnitPrice(prodId, qty),
      quantity: qty,
      image: resolveImagePath(p.image || 'assets/afghan-oil.png')
    });
  }

  saveCart();
  renderCart();
  openCartDrawer();

  // Firing AddToCart event
  if (typeof window.trackPixelEvent === 'function') {
    window.trackPixelEvent('AddToCart', {
      value: getUnitPrice(prodId, qty) * qty,
      currency: 'AED',
      content_name: p.name,
      content_type: 'product',
      content_ids: ['AFG_OIL_QTY_' + qty],
      num_items: qty
    });
  }
}

function removeFromCart(index) {
  if (typeof index === 'number') {
    cart.splice(index, 1);
  } else {
    cart = [];
  }
  saveCart();
  renderCart();
}

function updateQuantity(index, change) {
  if (cart.length === 0 || index >= cart.length) return;
  
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    removeFromCart(index);
  } else {
    cart[index].price = getUnitPrice(cart[index].id, cart[index].quantity);
    saveCart();
    renderCart();
  }
}

function openCartDrawer() {
  const overlay = document.getElementById('cartOverlay');
  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const overlay = document.getElementById('cartOverlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function renderCart() {
  const emptyState = document.getElementById('cartEmptyState');
  const itemsContainer = document.getElementById('cartItemsContainer');
  const cartFooter = document.getElementById('cartFooter');
  
  if (!itemsContainer) return;

  if (cart.length === 0) {
    if (emptyState) emptyState.style.display = 'flex';
    itemsContainer.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'none';
    
    const progressFill = document.getElementById('shippingProgress');
    if (progressFill) progressFill.style.width = '0%';
    const freeShippingText = document.getElementById('freeShippingText');
    if (freeShippingText) freeShippingText.textContent = 'أضيفي منتجات للحصول على شحن مجاني مبرد!';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  itemsContainer.style.display = 'block';
  if (cartFooter) cartFooter.style.display = 'flex';
  
  itemsContainer.innerHTML = '';
  
  cart.forEach((item, index) => {
    const resolvedCartImg = resolveImagePath(item.image || 'assets/afghan-oil.png');
    const visualHTML = `<img src="${resolvedCartImg}" alt="${item.name}" style="width:50px;height:75px;object-fit:contain;border-radius:6px;display:block;margin:auto;">`;

    const itemHTML = `
      <div class="cart-item" style="margin-bottom:1rem; border-bottom:1px solid var(--border); padding-bottom:1rem; display:flex; gap:1rem;">
        <div class="cart-item-visual" style="width:60px; height:80px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.02); border-radius:8px;">
          ${visualHTML}
        </div>
        <div class="cart-item-info" style="flex:1;">
          <div class="cart-item-title-row" style="display:flex; justify-content:space-between; align-items:start;">
            <h4 class="cart-item-name" style="font-size:0.88rem;font-weight:700;color:var(--text);">${item.name}</h4>
            <button class="remove-item-btn" onclick="removeFromCart(${index})" aria-label="إزالة" style="background:none;border:none;color:var(--text-muted);cursor:pointer;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
            </button>
          </div>
          <div class="cart-item-control-row" style="display:flex; justify-content:space-between; align-items:center; margin-top:0.75rem;">
            <div class="quantity-controller" style="display:flex; align-items:center; border:1px solid var(--border); border-radius:6px; padding:2px;">
              <button class="qty-btn" onclick="updateQuantity(${index}, -1)" style="background:none;border:none;color:var(--text);width:24px;height:24px;cursor:pointer;">-</button>
              <span class="qty-val" style="width:20px;text-align:center;font-weight:700;">${item.quantity}</span>
              <button class="qty-btn" onclick="updateQuantity(${index}, 1)" style="background:none;border:none;color:var(--text);width:24px;height:24px;cursor:pointer;">+</button>
            </div>
            <span class="cart-item-price" style="font-weight:700;color:var(--primary);">${item.price * item.quantity} <span>د.إ</span></span>
          </div>
        </div>
      </div>
    `;
    itemsContainer.insertAdjacentHTML('beforeend', itemHTML);
  });

  calculateTotals();
}

function calculateTotals() {
  if (cart.length === 0) return;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const shippingThreshold = 199;
  const isFreeShipping = subtotal >= shippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 19;
  const total = subtotal + shippingCost;

  const subtotalEl = document.getElementById('cartSubtotal');
  if (subtotalEl) subtotalEl.textContent = `${subtotal} د.إ`;
  const shippingEl = document.getElementById('cartShipping');
  if (shippingEl) shippingEl.textContent = isFreeShipping ? 'مجاني' : `${shippingCost} د.إ`;
  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = `${total} د.إ`;

  // Free shipping progress bar
  const progressFill = document.getElementById('shippingProgress');
  if (progressFill) {
    const progressPercent = Math.min((subtotal / shippingThreshold) * 100, 100);
    progressFill.style.width = `${progressPercent}%`;
  }

  const freeShippingText = document.getElementById('freeShippingText');
  if (freeShippingText) {
    if (isFreeShipping) {
      freeShippingText.innerHTML = '<span style="color: var(--success);">مبروك! طلبك مؤهل للشحن المجاني السريع! 🚚</span>';
    } else {
      const diff = shippingThreshold - subtotal;
      freeShippingText.textContent = `أضيفي منتجات بقيمة ${diff} د.إ إضافية للحصول على شحن مجاني!`;
    }
  }
}

// ----------------------------------------------------
// Checkout Page Logic (for legacy compatibility)
// ----------------------------------------------------
let currentPaymentMethod = 'cod';

function openCheckout() {
  if (cart.length === 0) return;
  closeCartDrawer();

  // Firing InitiateCheckout event
  if (typeof window.trackPixelEvent === 'function') {
    const totalVal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    window.trackPixelEvent('InitiateCheckout', {
      value: totalVal,
      currency: 'AED',
      content_ids: cart.map(item => 'AFG_OIL_QTY_' + item.quantity),
      num_items: cart.reduce((sum, item) => sum + item.quantity, 0)
    });
  }

  window.location.href = 'landing.html';
}

function closeCheckout() {
  const checkoutPage = document.getElementById('checkoutPage');
  if (checkoutPage) checkoutPage.classList.remove('open');
  document.body.style.overflow = '';
}

// Global Helper to create and save orders to localStorage and backend API
async function createAndSaveOrder({ name, phone, city, address, paymentMethod, items, subtotal, shipping, discount, total }) {
  const orderId = `AB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const order = {
    id: orderId,
    name,
    phone,
    city,
    address,
    paymentMethod: paymentMethod === 'cod' ? 'الدفع عند الاستلام (COD)' : 'بطاقة مدى / ائتمانية',
    items,
    subtotal,
    shipping,
    discount,
    total,
    date: new Date().toISOString(),
    status: 'pending'
  };

  // Save locally as fallback
  try {
    let orders = JSON.parse(localStorage.getItem('afghanbeauty_orders')) || [];
    orders.unshift(order);
    localStorage.setItem('afghanbeauty_orders', JSON.stringify(orders));
  } catch (e) {}

  // Send to backend API server
  try {
    if (!navigator.onLine) throw new Error('Offline');
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    const data = await res.json();
    if (data.success) {
      console.log("Order saved to server successfully:", data);
    } else {
      throw new Error(data.error || 'Server error');
    }
  } catch (e) {
    console.warn("Failed to save order to server, queuing for later sync:", e);
    // Queue in pendingOrders for later sync
    try {
      let pending = JSON.parse(localStorage.getItem('pendingOrders')) || [];
      pending.push(order);
      localStorage.setItem('pendingOrders', JSON.stringify(pending));
    } catch (e2) {}
  }

  return order;
}

// Sync pending orders to server when back online
async function syncPendingOrders() {
  let pending;
  try {
    pending = JSON.parse(localStorage.getItem('pendingOrders')) || [];
  } catch (e) { return; }
  if (pending.length === 0 || !navigator.onLine) return;

  console.log(`Syncing ${pending.length} pending order(s) to server...`);
  const stillPending = [];

  for (const order of pending) {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const data = await res.json();
      if (data.success) {
        console.log(`Synced pending order ${order.id} successfully`);
      } else {
        stillPending.push(order);
      }
    } catch (e) {
      stillPending.push(order);
    }
  }

  localStorage.setItem('pendingOrders', JSON.stringify(stillPending));
  if (stillPending.length === 0) {
    console.log("All pending orders synced successfully!");
  } else {
    console.warn(`${stillPending.length} order(s) still pending sync`);
  }
}

// Auto-sync when coming back online
window.addEventListener('online', syncPendingOrders);
// Also try syncing every 60 seconds
setInterval(syncPendingOrders, 60000);
// Try syncing on page load
document.addEventListener('DOMContentLoaded', () => setTimeout(syncPendingOrders, 3000));

// Landing page checkout dynamic implementations
function renderLpCartCards() {
  const container = document.getElementById('lp-cart-summary-table-container');
  if (!container) return;

  const isLandingPage = window.location.pathname.includes('landing.html');
  if (isLandingPage && cart.length === 0) {
    initProductsCatalog();
    const defaultProd = products['1'] || defaultProducts['1'];
    if (defaultProd) {
      cart = [{
        id: 1,
        name: defaultProd.name,
        price: Math.round(defaultProd.price * 0.85),
        quantity: 2,
        image: defaultProd.image || ''
      }];
      saveCart();
    }
  }

  container.innerHTML = cart.map((item, index) => {
    const resolvedLpImg = resolveImagePath(item.image || 'assets/afghan-oil.png');
    const visualHTML = `<img src="${resolvedLpImg}" alt="${item.name}" style="width:60px;height:80px;object-fit:contain;display:block;margin:auto;">`;

    return `
      <div class="offer-card best" style="display: flex; flex-direction: column; justify-content: space-between; padding: 1.5rem; border:1px solid var(--border); border-radius:16px;">
        <div style="display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1rem; text-align: right; width:100%;">
          <div style="width: 70px; height: 90px; background: radial-gradient(circle at 50% 30%,#faf6eb,#ebdcb9); border-radius: 12px; padding: 0.25rem; display: flex; align-items: center; justify-content: center; flex-shrink:0;">
            ${visualHTML}
          </div>
          <div style="flex: 1; min-width: 0;">
            <h3 style="font-size: 1rem; font-weight: 900; color: var(--text); margin-bottom: 0.25rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.name}</h3>
            <p style="font-size: 0.78rem; color: var(--text-muted);">السعر الفردي: ${item.price} د.إ</p>
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border); width: 100%;">
          <div class="quantity-controller" style="display: flex; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 8px; padding: 2px;">
            <button class="qty-btn" type="button" onclick="updateLpQuantity(${index}, -1)" style="background: none; border: none; color: var(--text); width: 28px; height: 28px; cursor: pointer; font-size: 1.1rem; font-weight: 700;">-</button>
            <span style="font-weight: 800; font-size: 0.95rem; width: 25px; text-align: center; display: inline-block;">${item.quantity}</span>
            <button class="qty-btn" type="button" onclick="updateLpQuantity(${index}, 1)" style="background: none; border: none; color: var(--text); width: 28px; height: 28px; cursor: pointer; font-size: 1.1rem; font-weight: 700;">+</button>
          </div>
          <div style="font-family: var(--font-en); font-weight: 900; font-size: 1.35rem; color: var(--primary);">
            ${item.price * item.quantity} <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 400;">د.إ</span>
          </div>
        </div>
        
        <button type="button" onclick="removeLpItem(${index})" style="background: none; border: none; color: var(--cancelled); cursor: pointer; font-size: 0.78rem; font-weight: 700; display: flex; align-items: center; gap: 0.25rem; margin-top: 0.75rem; align-self: flex-end;">
          ❌ إزالة
        </button>
      </div>
    `;
  }).join('');
}

window.updateLpQuantity = function(index, change) {
  if (index >= cart.length) return;
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  } else {
    initProductsCatalog();
    const item = cart[index];
    const p = products[item.id] || defaultProducts[item.id];
    if (p) {
      item.price = getUnitPrice(item.id, item.quantity);
    }
  }
  saveCart();
  renderLpCartCards();
  updateLpSummary();
};

window.removeLpItem = function(index) {
  if (index >= cart.length) return;
  cart.splice(index, 1);
  saveCart();
  renderLpCartCards();
  updateLpSummary();
};

function updateLpSummary() {
  if (cart.length === 0) {
    const sub = document.getElementById('lp-summary-subtotal'); if(sub) sub.textContent = '0 د.إ';
    const ship = document.getElementById('lp-summary-shipping'); if(ship) ship.textContent = '0 د.إ';
    const tot = document.getElementById('lp-summary-total'); if(tot) tot.textContent = '0 د.إ';
    const subBtn = document.getElementById('lp-submit-price'); if(subBtn) subBtn.textContent = '0 د.إ';
    const listContainer = document.getElementById('lp-summary-products-list');
    if (listContainer) listContainer.innerHTML = '<p style="text-align:center;padding:1rem;color:var(--text-muted);">السلة فارغة</p>';
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingThreshold = 199;
  const isFreeShipping = subtotal >= shippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 19;
  
  const paymentMethod = 'cod';
  let discount = 0;
  const discRow = document.getElementById('lp-card-disc-row');
  if (discRow) discRow.style.display = 'none';

  const total = subtotal + shippingCost - discount;

  const subEl = document.getElementById('lp-summary-subtotal'); if (subEl) subEl.textContent = `${subtotal} د.إ`;
  const shipEl = document.getElementById('lp-summary-shipping'); if (shipEl) shipEl.textContent = shippingCost === 0 ? 'مجاني 🎁' : `${shippingCost} د.إ`;
  const totEl = document.getElementById('lp-summary-total'); if (totEl) totEl.textContent = `${total} د.إ`;
  const subBtnEl = document.getElementById('lp-submit-price'); if (subBtnEl) subBtnEl.textContent = `${total} د.إ`;

  const stickyPrice = document.getElementById('lpStickyPrice');
  if (stickyPrice) {
    stickyPrice.textContent = `${total} د.إ` + (shippingCost === 0 ? ' · شحن مجاني' : ` + شحن ${shippingCost} د.إ`);
  }

  const listContainer = document.getElementById('lp-summary-products-list');
  if (listContainer) {
    listContainer.innerHTML = cart.map(item => `
      <div class="lp-summary-product" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
        <div class="lp-summary-thumb" style="width: 45px; height: 60px; background: radial-gradient(circle at 50% 30%,#FAF8F2,#EBF0EC); border-radius: 8px; padding: 0.25rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <img src="${resolveImagePath(item.image || 'assets/afghan-oil.png')}" style="width:100%;height:100%;object-fit:contain;">
        </div>
        <div style="flex:1;">
          <p style="font-weight: 800; font-size: 0.85rem; color: var(--text);">${item.name} × ${item.quantity}</p>
          <p style="font-size: 0.78rem; color: var(--text-muted);">${item.price * item.quantity} د.إ</p>
        </div>
      </div>
    `).join('');
  }
}

function loadLandingPageCheckout() {
  renderLpCartCards();
  updateLpSummary();
  
  const form = document.getElementById('lpCheckoutForm');
  if (form) {
    form.removeAttribute('onsubmit'); // remove inline to avoid conflicts
    form.addEventListener('submit', handleLpOrder);
  }
  
  window.lpSelectPay = function(method) {
    // COD only — no card payments
  };
}

async function handleLpOrder(event) {
  event.preventDefault();
  
  if (cart.length === 0) return;

  const name = document.getElementById('lp-name').value.trim();
  const phone = document.getElementById('lp-phone').value.trim();
  const city = document.getElementById('lp-city').value.trim();
  const district = document.getElementById('lp-district').value.trim();
  const addressDetail = document.getElementById('lp-address').value.trim();

  const phoneRegex = /^(05|5)\d{8}$/;
  if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
    alert('الرجاء إدخال رقم جوال إماراتي صحيح (مثال: 05xxxxxxxx)');
    return;
  }

  const paymentMethod = 'cod';

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingThreshold = 199;
  const isFreeShipping = subtotal >= shippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 19;
  const discount = 0;
  const total = subtotal + shippingCost;

  const orderItems = cart.map(item => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity
  }));

  const order = await createAndSaveOrder({
    name,
    phone,
    city,
    address: `${district}، ${addressDetail}`,
    paymentMethod,
    items: orderItems,
    subtotal,
    shipping: shippingCost,
    discount,
    total
  });

  cart = [];
  saveCart();
  renderCart();

  // Save order in localStorage for the thank you page and redirect
  localStorage.setItem('last_order', JSON.stringify(order));
  window.location.href = 'thankyou.html';
}

async function handlePlaceOrder(event) {
  event.preventDefault();
  
  if (cart.length === 0) return;

  const name = document.getElementById('shippingName').value.trim();
  const phone = document.getElementById('shippingPhone').value.trim();
  const city = document.getElementById('shippingCity').value.trim();
  const address = document.getElementById('shippingAddress').value.trim();

  const phoneRegex = /^(05|5)\d{8}$/;
  if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
    alert('الرجاء إدخال رقم جوال إماراتي صحيح (مثال: 05xxxxxxxx)');
    return;
  }

  const paymentMethod = 'cod';

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingThreshold = 199;
  const isFreeShipping = subtotal >= shippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 19;
  const discount = 0;
  const total = subtotal + shippingCost;

  const orderItems = cart.map(item => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity
  }));

  const order = await createAndSaveOrder({
    name,
    phone,
    city,
    address,
    paymentMethod,
    items: orderItems,
    subtotal,
    shipping: shippingCost,
    discount,
    total
  });

  cart = [];
  saveCart();
  renderCart();

  // Save order in localStorage for the thank you page and redirect
  localStorage.setItem('last_order', JSON.stringify(order));
  window.location.href = 'thankyou.html';
}

// Dynamic text legacy support
function applyDynamicTexts() {}

// Dynamic gallery legacy support
function applyProductGalleryImages() {}

// Dynamic details loaders for product.html
function loadProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id')) || 1;
  initProductsCatalog();
  const p = products[productId] || defaultProducts[productId] || defaultProducts[1];
  
  if (!p) return;

  // Preserve backwards-compatible bundle options
  updateBundlesLegacyMap(p);

  document.title = `${p.name} | AFGHAN BEAUTY أفغاني بيوتي`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', p.subtitle || p.name);

  const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  
  setTxt('prod-breadcrumb-text', p.name);
  setTxt('prod-title-text', p.name);
  setTxt('prod-short-desc-text', p.subtitle || '');
  setTxt('prod-desc-title-text', p.desc_title || '');
  setTxt('prod-desc-body-text', p.desc_body || '');
  
  const bulletsList = document.getElementById('prod-desc-bullets-list');
  if (bulletsList && p.desc_bullets) {
    bulletsList.innerHTML = p.desc_bullets.split('\n').map(line => {
      const cleaned = line.replace(/^[✦\s•\-*]+/, '').trim();
      if (!cleaned) return '';
      return `<li style="display:flex;gap:0.75rem;font-size:0.88rem;"><span style="color:var(--primary-hover);font-size:1.1rem;margin-top:-2px;">✦</span> ${cleaned}</li>`;
    }).filter(Boolean).join('');
  }

  setTxt('prod-target-title-text', p.target_title || '');
  const targetList = document.getElementById('prod-target-list');
  if (targetList && p.target_list) {
    targetList.innerHTML = p.target_list.split('\n').map(line => {
      const cleaned = line.replace(/^[✔\s•\-*+]+/, '').trim();
      if (!cleaned) return '';
      return `<div style="background:var(--surface-lime);border:1px solid var(--border);border-radius:14px;padding:1rem;font-size:0.88rem;"><strong>✔ </strong>${cleaned}</div>`;
    }).filter(Boolean).join('');
  }

  for (let i = 1; i <= 3; i++) {
    setTxt(`prod-howto-step-${i}-title`, p[`howto_${i}_title`] || '');
    setTxt(`prod-howto-step-${i}-desc`, p[`howto_${i}_desc`] || '');
  }

  const faqContainer = document.getElementById('prod-faq-container');
  if (faqContainer) {
    let faqHTML = '';
    for (let i = 1; i <= 5; i++) {
      const q = p[`faq_${i}_q`]?.trim();
      const a = p[`faq_${i}_a`]?.trim();
      if (q && a) {
        faqHTML += `
          <div class="faq-item" onclick="toggleFaq(this)">
            <button class="faq-question">${q}<span class="faq-icon">+</span></button>
            <div class="faq-answer"><div class="faq-answer-inner">${a}</div></div>
          </div>`;
      }
    }
    if (faqHTML) faqContainer.innerHTML = faqHTML;
  }

  const displayTubeImg = resolveImagePath(p.gallery_tube || p.image || 'assets/afghan-oil.png');
  const displayTextureImg = resolveImagePath(p.gallery_texture || 'assets/afghan-oil.png');
  const displayFormulaImg = resolveImagePath(p.gallery_formula || 'assets/afghan-oil.png');

  const viewTube = document.getElementById('galleryViewTube');
  if (viewTube) {
    viewTube.innerHTML = `<img src="${displayTubeImg}" alt="${p.name}" style="max-width:90%;max-height:90%;object-fit:contain;display:block;margin:auto;">`;
  }

  const viewTexture = document.getElementById('galleryViewTexture');
  if (viewTexture) {
    if (p.gallery_texture) {
      viewTexture.innerHTML = `<img src="${displayTextureImg}" alt="Texture" style="max-width:90%;max-height:90%;object-fit:contain;display:block;margin:auto;">`;
    }
  }

  const viewFormula = document.getElementById('galleryViewFormula');
  if (viewFormula) {
    if (p.gallery_formula) {
      viewFormula.innerHTML = `<img src="${displayFormulaImg}" alt="Formula" style="max-width:90%;max-height:90%;object-fit:contain;display:block;margin:auto;">`;
    }
  }

  const thumb0 = document.getElementById('prod-gallery-thumb-0');
  if (thumb0) thumb0.innerHTML = `<img src="${displayTubeImg}" style="width:100%;height:100%;object-fit:cover;">`;
  const thumb1 = document.getElementById('prod-gallery-thumb-1');
  if (thumb1 && p.gallery_texture) thumb1.innerHTML = `<img src="${displayTextureImg}" style="width:100%;height:100%;object-fit:cover;">`;
  const thumb2 = document.getElementById('prod-gallery-thumb-2');
  if (thumb2 && p.gallery_formula) thumb2.innerHTML = `<img src="${displayFormulaImg}" style="width:100%;height:100%;object-fit:cover;">`;

  const opt1 = document.querySelector('.bundle-option-btn[data-bundle-id="1"]');
  const opt2 = document.querySelector('.bundle-option-btn[data-bundle-id="2"]');
  const opt3 = document.querySelector('.bundle-option-btn[data-bundle-id="3"]');

  if (opt1) {
    opt1.querySelector('.bundle-opt-price').textContent = `${p.price} د.إ`;
    if (p.id == 1) {
      const p1Old = p.price * 2;
      opt1.setAttribute('onclick', `selectProductBundle(1, ${p.price}, ${p1Old}, 'الثانية بـ 1 درهم 🎁', this)`);
      
      const qtyEl = opt1.querySelector('.bundle-option-qty');
      if (qtyEl) qtyEl.textContent = '×1+1';
      
      const labelEl = opt1.querySelector('.bundle-option-label:not(.bundle-opt-price)');
      if (labelEl) labelEl.textContent = 'عبوة + الثانية بـ 1 درهم';
      
      let saveEl = opt1.querySelector('.bundle-option-save');
      if (!saveEl) {
        saveEl = document.createElement('div');
        saveEl.className = 'bundle-option-save';
        opt1.appendChild(saveEl);
      }
      saveEl.textContent = 'الثانية بـ 1 درهم 🎁';
    } else {
      opt1.setAttribute('onclick', `selectProductBundle(1, ${p.price}, null, null, this)`);
      
      const qtyEl = opt1.querySelector('.bundle-option-qty');
      if (qtyEl) qtyEl.textContent = '×1';
      
      const labelEl = opt1.querySelector('.bundle-option-label:not(.bundle-opt-price)');
      if (labelEl) labelEl.textContent = 'عبوة واحدة';
      
      const saveEl = opt1.querySelector('.bundle-option-save');
      if (saveEl) saveEl.remove();
    }
  }
  if (opt2) {
    const p2 = getUnitPrice(p.id, 2) * 2;
    const p2Old = p.price * 2;
    const label = p.id == 1 ? 'الثالثة مجاناً 🎁' : 'وفري 15%';
    opt2.querySelector('.bundle-opt-price').textContent = `${p2} د.إ`;
    opt2.setAttribute('onclick', `selectProductBundle(2, ${p2}, ${p2Old}, '${label}', this)`);
  }
  if (opt3) {
    const p3 = getUnitPrice(p.id, 3) * 3;
    const p3Old = p.price * 3;
    const label = p.id == 1 ? 'الرابعة مجاناً 🎁' : 'وفري 25%';
    opt3.querySelector('.bundle-opt-price').textContent = `${p3} د.إ`;
    opt3.setAttribute('onclick', `selectProductBundle(3, ${p3}, ${p3Old}, '${label}', this)`);
  }

  if (typeof selectedBundle !== 'undefined') {
    selectedBundle = 1;
    selectedPrice = p.price;
    const selectedPriceEl = document.getElementById('selectedPrice');
    if (selectedPriceEl) selectedPriceEl.innerHTML = `${p.price} <span>د.إ</span>`;
    const stickyPriceEl = document.getElementById('stickyPrice');
    if (stickyPriceEl) stickyPriceEl.textContent = `${p.price} د.إ`;
    
    const stickyBuyBarInfo = document.querySelector('.sticky-buy-bar-info p:first-child');
    if (stickyBuyBarInfo) stickyBuyBarInfo.textContent = p.name;
  }

  window.addSelectedBundleToCart = function() {
    addProductToCartWithQtyDiscount(productId, selectedBundle);
  };
}

// =====================================================
// HERO SECTION SLIDER LOGIC
// =====================================================
let currentHeroSlide = 0;
let heroSliderInterval = null;

function setHeroSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  if (slides.length === 0) return;
  
  currentHeroSlide = index;
  
  slides.forEach((slide, i) => {
    if (i === index) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });
  
  dots.forEach((dot, i) => {
    if (i === index) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
  
  // Reset auto-play interval
  resetHeroSliderInterval();
}

function nextHeroSlide() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;
  let next = (currentHeroSlide + 1) % slides.length;
  setHeroSlide(next);
}

function resetHeroSliderInterval() {
  if (heroSliderInterval) clearInterval(heroSliderInterval);
  heroSliderInterval = setInterval(nextHeroSlide, 5000);
}

// Make setHeroSlide globally accessible for HTML onclick attributes
window.setHeroSlide = setHeroSlide;

// Auto initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 0) {
    resetHeroSliderInterval();
  }
});
