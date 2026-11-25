"use client";

import { useEffect, useState } from "react";

type Language = "ar" | "en";

const translations: Record<string, string> = {
  "عالمك كله... في مكان واحد": "Your world... all in one place",
  "اكتشف عالماً من الخيارات، وصمّم تجربتك بطريقتك.": "Discover a world of choices and shape your experience your way.",
  "ادخل عالم يوشا": "Enter YOSHA",
  "طلبك في الطريق... أهلاً بك في يوشا": "Your order is on its way... Welcome to YOSHA",
  "التصنيفات": "Categories",
  "اكتشف المنتجات": "Discover products",
  "افتح متجرك": "Open your store",
  "دخول / حساب جديد": "Sign in / Create account",
  "القائمة": "Menu",
  "الرئيسية": "Home",
  "حسابك وخدماتك": "Your account & services",
  "لوحة التاجر": "Seller dashboard",
  "مركز العميل": "Customer center",
  "ملف التاجر · تعديل البيانات": "Seller profile · Edit details",
  "ملفي الشخصي · تعديل البيانات": "My profile · Edit details",
  "الملف الشخصي وبيانات المتجر": "Profile & store details",
  "طلباتي": "My orders",
  "المفضلة": "Favorites",
  "عناويني": "My addresses",
  "المحفظة": "Wallet",
  "التسوق والمتاجر": "Shopping & stores",
  "الدعم والمساعدة": "Help & support",
  "إدارة الملف الشخصي": "Manage profile",
  "تسجيل الخروج": "Sign out",
  "تسجيل الدخول": "Sign in",
  "تجربة تسوق جديدة": "A new shopping experience",
  "كل ما تبحث عنه": "Everything you are looking for",
  "في مكان واحد.": "In one place.",
  "اكتشف منتجات مميزة من متاجر متعددة، وتسوق بسهولة وأمان مع تجربة مصممة لتكبر معك.": "Discover great products from multiple stores and shop easily and securely with an experience designed to grow with you.",
  "ابدأ التسوق": "Start shopping",
  "أنشئ متجرك": "Create your store",
  "تجربة آمنة": "Secure experience",
  "خيارات توصيل": "Delivery options",
  "متاجر متنوعة": "Multiple stores",
  "اكتشف • اختَر • استمتع": "Discover • Choose • Enjoy",
  "تصفح أقسام السوق": "Browse marketplace departments",
  "تسوّق حسب الفئة": "Shop by category",
  "اختَر القسم وشاهد المنتجات والمتاجر التي تبيع ما تبحث عنه.": "Choose a category and explore products and stores that offer what you need.",
  "استكشف القسم": "Explore category",
  "سوق يوشا في انتظارك": "YOSHA marketplace is waiting for you",
  "اكتشف المنتجات التي تناسبك": "Discover products that suit you",
  "تصفح المنتجات المتاحة من المتاجر المعتمدة، قارن الأسعار، وأضف اختياراتك إلى سلة التسوق بسهولة.": "Browse products from approved stores, compare prices, and easily add your choices to your cart.",
  "تصفح كل المنتجات": "Browse all products",
  "لديك منتجات تريد بيعها؟": "Have products to sell?",
  "اعرض منتجاتك في سوق يوشا": "List your products on YOSHA",
  "افتح متجرك، أضف صور منتجاتك، واستقبل طلبات العملاء من مكان واحد.": "Open your store, add product photos, and receive customer orders in one place.",
  "ابدأ البيع الآن": "Start selling now",
  "عالمك كله في مكان واحد. تسوّق واكتشف المتاجر وابدأ تجارتك من منصة واحدة.": "Your world in one place. Shop, discover stores, and start your business on one platform.",
  "السودان": "Sudan",
  "العربية": "Arabic",
  "تابعنا على فيسبوك": "Follow us on Facebook",
  "يوشا": "YOSHA",
  "سوق يوشا": "YOSHA Market",
  "ابدأ البيع": "Start selling",
  "تواصل معنا": "Contact us",
  "النظام المتكامل": "The complete platform",
  "إدارة المنتجات": "Product management",
  "مركز العميل": "Customer center",
  "الملف الشخصي": "Profile",
  "الموارد": "Resources",
  "سلة التسوق": "Shopping cart",
  "إتمام الطلب": "Checkout",
  "مركز الدعم": "Support center",
  "التقديم كتاجر": "Apply as a seller",
  "راسل فريق يوشا": "Contact the YOSHA team",
  "جميع الحقوق محفوظة.": "All rights reserved.",
  "مرحباً بك في يوشا": "Welcome to YOSHA",
  "سجل دخولك أو أنشئ حساباً جديداً.": "Sign in or create a new account.",
  "مرحباً بك": "Welcome",
  "الاسم الكامل": "Full name",
  "البريد الإلكتروني": "Email address",
  "كلمة المرور": "Password",
  "رقم الهاتف": "Phone number",
  "حفظ التعديلات": "Save changes",
  "حفظ بياناتك": "Save your details",
  "ملفي الشخصي": "My profile",
  "بيانات متجرك": "Your store details",
  "اسم المتجر": "Store name",
  "نبذة عن المتجر": "About your store",
  "تغيير الصورة": "Change photo",
  "تغيير شعار المتجر": "Change store logo",
  "العودة إلى لوحة التاجر": "Back to seller dashboard",
  "العودة إلى مركز العميل": "Back to customer center",
  "جارٍ تحميل ملفك الشخصي...": "Loading your profile...",
  "جارٍ تحميل حسابك...": "Loading your account...",
  "حساب YOSHA": "YOSHA account",
  "تابع حسابك وخدماتك من مكان واحد.": "Manage your account and services in one place.",
  "ابدأ التسوق": "Start shopping",
  "تواصل مع الدعم": "Contact support",
  "مركز المساعدة والدعم": "Help & Support Center",
  "نحن هنا لمساعدتك. تواصل مع فريق يوشا عبر البريد الإلكتروني أو تابع صفحتنا على فيسبوك.": "We are here to help. Contact the YOSHA team by email or follow our Facebook page.",
  "صفحة يوشا على فيسبوك": "YOSHA on Facebook",
  "تابعنا وتواصل معنا": "Follow and contact us",
  "حالة المتجر": "Store status",
  "الطلبات": "Orders",
  "الفواتير": "Invoices",
  "سجلات العمولات": "Commission records",
  "اشتراكات المتجر": "Store subscriptions",
  "الفواتير والمدفوعات": "Invoices & payments",
  "العمولات": "Commissions",
  "طلبات المتجر": "Store orders",
  "إضافة منتج جديد": "Add a new product",
  "تعديل المنتج": "Edit product",
  "اسم المنتج": "Product name",
  "وصف المنتج": "Product description",
  "الكمية المتاحة": "Available quantity",
  "بدون تصنيف": "Uncategorized",
  "رابط صورة المنتج (اختياري)": "Product image URL (optional)",
  "نشر المنتج في السوق": "Publish product in marketplace",
  "إضافة المنتج": "Add product",
  "حذف": "Delete",
  "تعديل": "Edit",
  "تحديث": "Refresh",
  "منتجات متجرك": "Your store products",
  "لا يوجد متجر مرتبط بهذا الحساب": "No store is linked to this account",
  "لم تضف منتجات بعد.": "You have not added any products yet.",
  "لوحة إدارة محمية": "Protected admin area",
  "نظرة عامة": "Overview",
  "التجار والمتاجر": "Sellers & stores",
  "الاشتراكات والباقات": "Subscriptions & plans",
  "المدفوعات": "Payments",
  "المستخدمون": "Users",
  "إنشاء حساب": "Create account",
  "الدخول": "Sign in",
  "إنشاء حساب جديد": "Create a new account",
  "أدخل رقم هاتفك": "Enter your phone number",
  "جارٍ الحفظ...": "Saving...",
  "تم حفظ بيانات ملفك الشخصي بنجاح.": "Your profile has been saved successfully.",
  "تم تحديث الصورة بنجاح.": "Photo updated successfully.",
  "السعر بالجنيه السوداني": "Price in Sudanese pounds",
  "المخزون": "Stock",
  "منشور": "Published",
  "مسودة": "Draft",
  "استخدم صورة JPG أو PNG أو WEBP.": "Use a JPG, PNG, or WEBP image.",
  "حجم الصورة يجب ألا يتجاوز 5 ميجابايت.": "Image size must not exceed 5 MB.",
  "ملابس رجالية": "Men's clothing",
  "إطلالات رجالية يومية ورسمية": "Everyday and formal men's styles",
  "ملابس نسائية": "Women's clothing",
  "أزياء وإطلالات نسائية": "Women's fashion and styles",
  "الأحذية والحقائب": "Shoes & bags",
  "أحذية وحقائب لكل المناسبات": "Shoes and bags for every occasion",
  "الهواتف والإلكترونيات": "Phones & electronics",
  "هواتف وأجهزة وإكسسوارات": "Phones, devices & accessories",
  "الكمبيوتر والألعاب": "Computers & gaming",
  "لابتوبات وملحقات وألعاب": "Laptops, accessories & games",
  "المنزل والمطبخ": "Home & kitchen",
  "أثاث وأدوات منزلية": "Furniture & homeware",
  "الجمال والعناية": "Beauty & care",
  "عناية شخصية ومستحضرات تجميل": "Personal care & cosmetics",
  "الأطفال والألعاب": "Kids & toys",
  "ملابس وألعاب ومستلزمات الأطفال": "Children's clothing, toys & essentials",
  "الرياضة واللياقة": "Sports & fitness",
  "معدات وملابس رياضية": "Sports equipment & clothing",
  "الساعات والإكسسوارات": "Watches & accessories",
  "ساعات وإكسسوارات أنيقة": "Watches and stylish accessories",
  "السيارات وقطع الغيار": "Cars & spare parts",
  "إكسسوارات وقطع غيار": "Accessories & spare parts",
  "الكتب والمستلزمات": "Books & stationery",
  "كتب وأدوات مكتبية ودراسية": "Books, office and school supplies",
  "سجل دخولك أو أنشئ حساباً جديداً.": "Sign in or create a new account.",
  "تأكيد كلمة المرور": "Confirm password",
  "نسيت كلمة المرور؟": "Forgot password?",
  "إنشاء حساب جديد": "Create a new account",
  "الدخول إلى حسابك": "Sign in to your account",
  "السعر": "Price",
  "التصنيف": "Category",
  "الكمية": "Quantity",
  "إضافة إلى السلة": "Add to cart",
  "متابعة التسوق": "Continue shopping",
  "إتمام الشراء": "Complete purchase",
  "تفاصيل الطلب": "Order details",
  "عنوان التوصيل": "Delivery address",
  "طريقة الدفع": "Payment method",
  "تأكيد الطلب": "Confirm order",
  "جارٍ تحميل المنتجات...": "Loading products...",
  "لا توجد منتجات متاحة حالياً.": "No products are currently available.",
  "ابحث عن منتج": "Search for a product",
  "كل الفئات": "All categories",
  "المنتجات": "Products",
  "المتاجر": "Stores",
  "طلب إنشاء متجر": "Store application",
  "قدّم طلب إنشاء متجر أولاً.": "Submit a store application first.",
  "متجرك قيد المراجعة أو موقوف. ستتمكن من إدارة المنتجات بعد اعتماد المتجر.": "Your store is under review or suspended. You can manage products once it is approved.",
  "لا يوجد متجر مرتبط بهذا الحساب بعد.": "No store is linked to this account yet."
};

const reverse = Object.fromEntries(Object.entries(translations).map(([ar, en]) => [en, ar]));

function translate(value: string, language: Language) {
  const source = language === "en" ? translations : reverse;
  const exact = source[value.trim()];
  if (exact) return value.replace(value.trim(), exact);
  let result = value;
  for (const [from, to] of Object.entries(source)) {
    if (from.length > 3 && result.includes(from)) result = result.split(from).join(to);
  }
  return result;
}

export default function LanguageExperience() {
  const [language, setLanguage] = useState<Language>("ar");
  useEffect(() => {
    const saved = localStorage.getItem("yosha-language");
    const initial: Language = saved === "en" ? "en" : "ar";
    setLanguage(initial);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.body.dataset.language = language;
    const process = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      let node: Node | null = root;
      while (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const value = node.nodeValue || "";
          if (value.trim()) {
            const translated = translate(value, language);
            if (translated !== value) node.nodeValue = translated;
          }
        } else if (node instanceof HTMLElement) {
          for (const attr of ["placeholder", "aria-label", "title"]) {
            const value = node.getAttribute(attr);
            if (value) {
              const translated = translate(value, language);
              if (translated !== value) node.setAttribute(attr, translated);
            }
          }
        }
        node = walker.nextNode();
      }
    };
    process(document.body);
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === "characterData" && record.target.nodeType === Node.TEXT_NODE) {
          const node = record.target as Text;
          const translated = translate(node.nodeValue || "", language);
          if (translated !== node.nodeValue) node.nodeValue = translated;
        }
        record.addedNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            const translated = translate(node.nodeValue || "", language);
            if (translated !== node.nodeValue) node.nodeValue = translated;
          } else process(node);
        });
        if (record.target instanceof HTMLElement) process(record.target);
      }
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, [language]);

  function choose(next: Language) {
    localStorage.setItem("yosha-language", next);
    setLanguage(next);
  }

  return (
    <div className="yosha-language-switch" role="group" aria-label="Choose language">
      <button type="button" onClick={() => choose("ar")} aria-pressed={language === "ar"} className={language === "ar" ? "active" : ""}>العربية</button>
      <span aria-hidden="true">|</span>
      <button type="button" onClick={() => choose("en")} aria-pressed={language === "en"} className={language === "en" ? "active" : ""}>English</button>
      <style jsx>{`
        .yosha-language-switch{position:fixed;z-index:2000;top:16px;inset-inline-end:18px;display:flex;align-items:center;gap:8px;padding:7px 11px;border:1px solid #d8e9dc;border-radius:30px;background:rgba(255,255,255,.94);box-shadow:0 6px 22px #153f2b18;color:#496451;font:600 12px Arial,sans-serif;backdrop-filter:blur(12px)}
        .yosha-language-switch button{border:0;background:transparent;color:#587260;padding:5px 7px;border-radius:18px;cursor:pointer;font:inherit}
        .yosha-language-switch button.active{background:#e7f5eb;color:#17683c;font-weight:800}
        @media(max-width:600px){.yosha-language-switch{top:10px;inset-inline-end:10px;padding:5px 7px;font-size:11px}.yosha-language-switch button{padding:5px}}
        :global(html[dir="ltr"] body){direction:ltr}
        :global(html[dir="rtl"] body){direction:rtl}
      `}</style>
    </div>
  );
}
