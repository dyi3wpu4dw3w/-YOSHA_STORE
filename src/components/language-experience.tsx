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
  "تأكيد كلمة المرور": "Confirm password",
  "نسيت كلمة المرور؟": "Forgot password?",
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
  "لا يوجد متجر مرتبط بهذا الحساب بعد.": "No store is linked to this account yet.",
  "حوّل تجارتك إلى تجربة رقمية.": "Turn your business into a digital experience.",
  "أنشئ متجرك، أدر منتجاتك وطلباتك، وتابع أداء تجارتك من مركز واحد.": "Create your store, manage your products and orders, and track your business performance from one central hub.",
  "ابدأ إنشاء متجرك": "Create your store",
  "لوحة التاجر": "Seller dashboard",
  "متجر مستقل": "Independent storefront",
  "صفحة عامة تحمل هوية متجرك": "A public storefront that reflects your brand",
  "إدارة المنتجات": "Product management",
  "إضافة المنتجات والمخزون": "Add products and manage inventory",
  "متابعة المبيعات": "Sales tracking",
  "مؤشرات الطلبات والأداء": "Order and performance metrics",
  "إدارة آمنة": "Secure management",
  "صلاحيات واضحة لكل حساب": "Clear permissions for every account",
  "تفعيل المتجر يتطلب تسجيل الدخول، مراجعة طلب البائع، وضبط الاشتراك من قاعدة البيانات.": "Store activation requires signing in, seller application review, and subscription configuration in the database.",
  "← الرئيسية": "← Home",
  "مركز البائعين": "Seller center",
  "أرسل بيانات نشاطك التجاري لبدء مراجعة الطلب.": "Submit your business details to begin the review process.",
  "اسم النشاط التجاري": "Business name",
  "رقم التواصل": "Contact number",
  "نبذة عن نشاطك والمنتجات التي ستبيعها": "Tell us about your business and the products you plan to sell",
  "إرسال طلب المراجعة": "Submit application for review",
  "جارٍ الإرسال...": "Submitting...",
  "إعدادات قاعدة البيانات غير مكتملة.": "Database configuration is incomplete.",
  "وصل طلبك بنجاح، وسيتم مراجعته من إدارة يوشا.": "Your application was submitted successfully and will be reviewed by YOSHA.",
  "تعذر إرسال الطلب": "Could not submit the application",
  "إضافة المنتجات": "Add products",
  "المخزون": "Inventory",
  "الطلبات": "Orders",
  "أداء تجارتك": "Business performance",
  "إنشاء متجرك": "Create your store",
  "إدارة متجرك": "Manage your store",
  "مراجعة طلب البائع": "Seller application review",
  "تسجيل الدخول، مراجعة طلب البائع، وضبط الاشتراك من قاعدة البيانات.": "Sign-in, seller application review, and subscription setup in the database."
};


const extraTranslations: Record<string, string> = {
  "تابع طلباتك وحالات الشحن هنا بعد إتمام أول عملية شراء.": "Track your orders and shipping status here after your first purchase.",
  "ستظهر طلباتك وحالات الشحن هنا بعد إتمام أول عملية شراء.": "Your orders and shipping updates will appear here after your first purchase.",
  "المنتجات التي تحفظها في المفضلة ستجدها هنا.": "Products you save to your favorites will appear here.",
  "يمكنك متابعة عناوين التوصيل المحفوظة هنا.": "You can manage your saved delivery addresses here.",
  "رصيدك وحركات محفظتك ستظهر هنا عند تفعيل خدمة المحفظة.": "Your balance and wallet transactions will appear here when the wallet service is enabled.",
  "تعذر الاتصال بخدمة الحساب حالياً.": "The account service is currently unavailable.",
  "تعذر تحميل حسابك...": "Loading your account...",
  "مرحباً بك": "Welcome",
  "ابدأ التسوق": "Start shopping",
  "تسجيل الخروج": "Sign out",
  "إعدادات Supabase غير مكتملة.": "Supabase configuration is incomplete.",
  "استخدم صورة JPG أو PNG أو WEBP.": "Please use a JPG, PNG, or WEBP image.",
  "حجم الصورة يجب ألا يتجاوز 5 ميجابايت.": "Image size must not exceed 5 MB.",
  "لا يوجد متجر مرتبط بحسابك حتى الآن.": "No store is linked to your account yet.",
  "تم تحديث الصورة بنجاح.": "Image updated successfully.",
  "تعذر رفع الصورة.": "Unable to upload the image.",
  "تم حفظ بيانات ملفك الشخصي بنجاح.": "Your profile details have been saved successfully.",
  "تعذر حفظ البيانات.": "Unable to save your details.",
  "العودة إلى": "Back to",
  "ملف التاجر": "Seller profile",
  "ملفي الشخصي": "My profile",
  "الصورة الشخصية": "Profile photo",
  "صاحب الحساب": "Account holder",
  "تغيير الصورة": "Change photo",
  "الاسم الكامل": "Full name",
  "البريد الإلكتروني": "Email address",
  "رقم الهاتف": "Phone number",
  "شعار المتجر": "Store logo",
  "تغيير شعار المتجر": "Change store logo",
  "نبذة عن المتجر": "About your store",
  "حفظ التعديلات": "Save changes",
  "جارٍ الحفظ...": "Saving...",
  "حساب التاجر لم يرتبط بمتجر معتمد بعد. ستظهر بيانات المتجر هنا بعد اعتماد طلبك.": "Your seller account is not linked to an approved store yet. Store details will appear here once your application is approved.",
  "جارٍ تحميل ملفك الشخصي...": "Loading your profile...",
  "جارٍ التحقق من الصلاحيات...": "Checking permissions...",
  "منطقة إدارة محمية": "Protected administration area",
  "سجل الدخول بحساب الإدارة.": "Sign in with an administrator account.",
  "أكمل إعدادات Supabase أولاً.": "Complete the Supabase configuration first.",
  "هذا الحساب لا يمتلك صلاحية مدير المنصة.": "This account does not have platform administrator privileges.",
  "← المتجر": "← Store",
  "مركز إدارة المنصة والعمليات المالية.": "Platform and financial operations management center.",
  "تحديث البيانات": "Refresh data",
  "ملخص المنصة": "Platform overview",
  "إجمالي المستخدمين:": "Total users:",
  "القوائم تعرض آخر 100 سجل لكل قسم.": "Lists show the latest 100 records in each section.",
  "طلبات إنشاء المتاجر": "Store applications",
  "النشاط": "Business",
  "الهاتف": "Phone",
  "الحالة": "Status",
  "الإجراء": "Action",
  "اعتماد": "Approve",
  "رفض": "Reject",
  "إنشاء باقة اشتراك": "Create subscription plan",
  "السعر SDG": "Price (SDG)",
  "المدة بالأيام": "Duration in days",
  "العمولة %": "Commission %",
  "إضافة الباقة": "Add plan",
  "الباقات": "Plans",
  "يوم": "days",
  "متوقفة": "Inactive",
  "اشتراكات التجار": "Seller subscriptions",
  "ينتهي:": "Ends:",
  "تفعيل وإصدار فاتورة": "Activate and issue invoice",
  "رقم الفاتورة": "Invoice number",
  "النوع": "Type",
  "المبلغ": "Amount",
  "تاريخ الإصدار": "Issue date",
  "المراجعة": "Review",
  "اعتماد الدفع": "Approve payment",
  "إلغاء": "Cancel",
  "مراجعة المدفوعات": "Payment review",
  "تأكيد الدفع": "Confirm payment",
  "دفتر العمولات": "Commission ledger",
  "تُحتسب العمولات من الطلبات التي تم تسليمها، وفق نسبة الباقة الفعالة للتاجر.": "Commissions are calculated on delivered orders using the seller's active plan rate.",
  "تسجيل العمولة": "Record commission",
  "معلق": "Pending",
  "مؤكد": "Confirmed",
  "قيد التجهيز": "Processing",
  "تم الشحن": "Shipped",
  "تم التسليم": "Delivered",
  "ملغي": "Cancelled",
  "بدون اسم": "Unnamed",
  "جارٍ تأكيد بريدك الإلكتروني...": "Confirming your email address...",
  "تعذر الاتصال بالخدمة. حاول مرة أخرى لاحقاً.": "Unable to connect to the service. Please try again later.",
  "رابط التأكيد غير مكتمل أو منتهي الصلاحية.": "The confirmation link is incomplete or has expired.",
  "تعذر تأكيد البريد:": "Unable to confirm email:",
  "تم تأكيد بريدك الإلكتروني بنجاح. أهلاً بك في يوشا!": "Your email has been confirmed successfully. Welcome to YOSHA!",
  "أضف إعدادات Supabase في ملف البيئة أولاً.": "Add your Supabase settings to the environment file first.",
  "تم إرسال طلب التسجيل. راجع بريدك لتأكيد الحساب.": "Your registration request was sent. Check your email to confirm your account.",
  "تعذر إكمال العملية": "Unable to complete the operation",
  "حساب جديد": "New account",
  "كلمة المرور (6 أحرف على الأقل)": "Password (at least 6 characters)",
  "جارٍ التنفيذ...": "Processing...",
  "دخول": "Sign in",
  "إنشاء الحساب": "Create account",
  "← متابعة التسوق": "← Continue shopping",
  "سلة التسوق": "Shopping cart",
  "سلتك فارغة.": "Your cart is empty.",
  "تصفح المنتجات": "Browse products",
  "تقليل": "Decrease",
  "زيادة": "Increase",
  "الإجمالي:": "Total:",
  "رسوم التوصيل تُحدد حسب المنطقة.": "Delivery fees are determined by location.",
  "الخرطوم": "Khartoum",
  "السلة فارغة": "Your cart is empty",
  "تم إنشاء الطلب بنجاح. رقم الطلب:": "Your order was created successfully. Order number:",
  "تعذر إنشاء الطلب": "Unable to create the order",
  "← العودة للسلة": "← Back to cart",
  "أدخل بيانات التوصيل واختر طريقة الدفع.": "Enter your delivery details and choose a payment method.",
  "اسم المستلم": "Recipient name",
  "المدينة": "City",
  "المنطقة / الحي": "Area / District",
  "العنوان بالتفصيل": "Detailed address",
  "الدفع عند الاستلام": "Cash on delivery",
  "تحويل بنكي (مراجعة يدوية)": "Bank transfer (manual review)",
  "بنكك (مراجعة يدوية)": "Bankak (manual review)",
  "ماي كاشي (مراجعة يدوية)": "MyCashi (manual review)",
  "فوري (مراجعة يدوية)": "Fawry (manual review)",
  "جارٍ إرسال الطلب...": "Submitting order...",
  "إعدادات Supabase غير مكتملة. تعذر تحميل المنتجات حالياً.": "Supabase is not configured. Products cannot be loaded right now.",
  "تعذر تحميل السوق.": "Unable to load the marketplace.",
  "أُضيف المنتج إلى السلة بنجاح.": "Product added to cart successfully.",
  "تصنيفات المنتجات": "Product categories",
  "ابحث عن منتج أو وصفه": "Search for a product or description",
  "البحث عن منتج": "Search products",
  "متجر يوشا": "YOSHA Store",
  "لا توجد نتائج مطابقة": "No matching results",
  "لا توجد منتجات منشورة حالياً": "There are no published products yet",
  "جرّب كلمة بحث أخرى أو امسح البحث لعرض كل المنتجات.": "Try another search term or clear the search to see all products.",
  "يمكن للتجار إضافة منتجاتهم بعد اعتماد متاجرهم.": "Sellers can add products once their stores are approved.",
  "قدّم طلب إنشاء متجر أولاً.": "Submit a store application first.",
  "راجع اسم المنتج والسعر والكمية قبل الحفظ.": "Check the product name, price, and quantity before saving.",
  "تم تحديث المنتج.": "Product updated.",
  "تمت إضافة المنتج.": "Product added.",
  "تعذر حفظ المنتج.": "Unable to save the product.",
  "هل تريد حذف المنتج نهائياً؟": "Do you want to permanently delete this product?",
  "تم حذف المنتج.": "Product deleted.",
  "تعذر حذف المنتج.": "Unable to delete the product.",
  "جارٍ تحميل مركز المنتجات...": "Loading product management...",
  "← العودة إلى لوحة التاجر": "← Back to seller dashboard",
  "لا يوجد متجر مرتبط بالحساب": "No store is linked to this account",
  "متجرك قيد المراجعة أو موقوف. ستتمكن من إدارة المنتجات بعد اعتماد المتجر.": "Your store is under review or suspended. You can manage products after approval.",
  "السعر بالجنيه السوداني": "Price in Sudanese pounds",
  "الكمية المتاحة": "Available quantity",
  "رابط صورة المنتج (اختياري)": "Product image URL (optional)",
  "نشر المنتج في السوق": "Publish product in marketplace",
  "إضافة منتج": "Add product",
  "لم تضف منتجات بعد.": "You have not added any products yet.",
  "المخزون": "Inventory",
  "منشور": "Published",
  "مسودة": "Draft",
  "← الرئيسية": "← Home",
  "مركز المساعدة والدعم": "Help & Support Center",
  "نحن هنا لمساعدتك. تواصل مع فريق يوشا عبر البريد الإلكتروني أو تابع صفحتنا على فيسبوك.": "We're here to help. Contact the YOSHA team by email or follow our Facebook page.",
  "صفحة يوشا على فيسبوك": "YOSHA on Facebook",
  "تابعنا وتواصل معنا": "Follow and contact us",
  "الرئيسية": "Home",
  "حسابي": "My account",
  "مرحباً بك في يوشا": "Welcome to YOSHA",
  "شعار YOSHA": "YOSHA logo",
  "فتح القائمة الجانبية": "Open sidebar",
  "إغلاق القائمة": "Close menu",
  "القائمة الرئيسية": "Main menu",
  "إغلاق": "Close",
  "لوحة التاجر": "Seller dashboard",
  "ملف التاجر · تعديل البيانات": "Seller profile · Edit details",
  "ملفي الشخصي · تعديل البيانات": "My profile · Edit details",
  "مركز العميل": "Customer center",
  "كل ما تبحث عنه": "Everything you're looking for",
  "تصفح أقسام السوق": "Browse marketplace categories",
  "لديك منتجات تريد بيعها؟": "Have products to sell?",
  "اعرض منتجاتك في سوق يوشا": "List your products on YOSHA",
  "افتح متجرك، أضف صور منتجاتك، واستقبل طلبات العملاء من مكان واحد.": "Open your store, add product photos, and receive customer orders in one place.",
  "عن يوشا": "About YOSHA",
  "مركز الدعم": "Support center",
  "مركز المساعدة": "Help center",
  "إعدادات الحساب": "Account settings",
  "اللغة / Language": "Language",
  "السودان": "Sudan",
  "العربية": "Arabic",
  "يوشا": "YOSHA",
  "الطلبات": "Orders",
  "الفواتير": "Invoices",
  "العمولات": "Commissions",
  "المستخدمون": "Users",
  "المدفوعات": "Payments",
  "نظرة عامة": "Overview",
  "التجار والمتاجر": "Sellers & stores",
  "الاشتراكات والباقات": "Subscriptions & plans",
  "← مركز البائعين": "← Seller center",
  "← مركز العميل": "← Customer center",
  "تحديث": "Refresh",
  "حالة المتجر": "Store status",
  "سجلات العمولات": "Commission records",
  "اشتراكات المتجر": "Store subscriptions",
  "الفواتير والمدفوعات": "Invoices & payments",
  "طلبات المتجر": "Store orders",
  "لا توجد عمولات مسجلة بعد.": "No commissions have been recorded yet.",
  "عرض فقط حالياً": "Read-only for now",
  "لا توجد طلبات لهذا المتجر حتى الآن.": "This store has no orders yet.",
  "تم إنشاء طلب الاشتراك وإصدار فاتورته. راجع قسم الفواتير لإرسال إثبات الدفع.": "Subscription request created and its invoice issued. Go to Invoices to submit payment proof.",
  "تعذر إنشاء الاشتراك": "Unable to create the subscription",
  "تم إرسال بيانات الدفع للمراجعة الإدارية.": "Payment details submitted for administrative review.",
  "تعذر إرسال الدفع": "Unable to submit payment",
  "أكمل إعداد Supabase.": "Complete Supabase setup.",
  "سجل الدخول أولاً.": "Please sign in first.",
  "طلب اشتراك": "Request subscription",
  "اختر باقة": "Choose a plan",
  "البداية": "Start",
  "لم تبدأ": "Not started",
  "النهاية": "End",
  "إرسال الدفع للمراجعة": "Submit payment for review",
  "رقم مرجع التحويل": "Transfer reference number",
  "رابط إثبات الدفع (اختياري)": "Payment proof URL (optional)",
  "بنكك": "Bankak",
  "ماي كاشي": "MyCashi",
  "فوري": "Fawry",
  "تحويل بنكي": "Bank transfer",
  "تفعيل المتجر يتطلب تسجيل الدخول، مراجعة طلب البائع، وضبط الاشتراك من قاعدة البيانات.": "Store activation requires sign-in, seller application review, and subscription configuration in the database.",
  "إدارة آمنة": "Secure management",
  "صلاحيات واضحة لكل حساب": "Clear permissions for every account",
  "مؤشرات الطلبات والأداء": "Order and performance metrics",
  "متابعة المبيعات": "Sales tracking",
  "متجر مستقل": "Independent storefront",
  "صفحة عامة تحمل هوية متجرك": "A public storefront that reflects your brand",
  "إضافة المنتجات والمخزون": "Add products and manage inventory",
  "إنشاء باقة": "Create plan",
  "تم تحديث طلب التاجر.": "Seller application updated.",
  "تم تحديث حالة الدفع.": "Payment status updated.",
  "تم اعتماد الفاتورة وتفعيل الاشتراك المرتبط.": "Invoice approved and linked subscription activated.",
  "تم إلغاء الفاتورة.": "Invoice cancelled.",
  "تم تفعيل الاشتراك.": "Subscription activated.",
  "تم تسجيل العمولات وإصدار فواتيرها.": "Commissions recorded and invoices issued.",
  "تم تحديث حالة الطلب.": "Order status updated.",
  "تم إنشاء الباقة.": "Plan created.",
  "تعذر تنفيذ العملية": "Unable to complete the action",
  "طلبات البائعين": "Seller applications",
  "المتاجر المعتمدة": "Approved stores",
  "مدفوعات للمراجعة": "Payments pending review",
  "فواتير غير مدفوعة": "Unpaid invoices",
  "إدارة المنتجات": "Product management",
  "اللغة": "Language"
};
const allTranslations: Record<string, string> = { ...translations, ...extraTranslations };

const reverse = Object.fromEntries(Object.entries(allTranslations).filter(([ar]) => ar !== "يوشا").map(([ar, en]) => [en, ar]));

function translate(value: string, language: Language) {
  const source = language === "en" ? allTranslations : reverse;
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
    const handleLanguageChange = (event: Event) => {
      const next = (event as CustomEvent<Language>).detail;
      if (next === "ar" || next === "en") setLanguage(next);
    };
    window.addEventListener("yosha-language-change", handleLanguageChange);
    return () => window.removeEventListener("yosha-language-change", handleLanguageChange);
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

  return null;
}

export function LanguagePicker() {
  const [language, setLanguage] = useState<Language>("ar");
  useEffect(() => {
    const saved = localStorage.getItem("yosha-language");
    setLanguage(saved === "en" ? "en" : "ar");
  }, []);
  function choose(next: Language) {
    localStorage.setItem("yosha-language", next);
    setLanguage(next);
    window.dispatchEvent(new CustomEvent("yosha-language-change", { detail: next }));
  }
  return (
    <div className="drawer-language" role="group" aria-label="Choose language">
      <span className="drawer-language-title">اللغة / Language</span>
      <div className="drawer-language-options">
        <button type="button" onClick={() => choose("ar")} aria-pressed={language === "ar"} className={language === "ar" ? "active" : ""}>العربية</button>
        <button type="button" onClick={() => choose("en")} aria-pressed={language === "en"} className={language === "en" ? "active" : ""}>English</button>
      </div>
      <style jsx>{`
        .drawer-language{margin:12px 0 6px;padding:13px 12px;border:1px solid #e1ece4;border-radius:14px;background:#f8fbf8}
        .drawer-language-title{display:block;margin-bottom:9px;color:#607568;font-size:12px;font-weight:800}
        .drawer-language-options{display:flex;gap:8px}
        .drawer-language button{flex:1;border:1px solid #dce9df;background:#fff;color:#476251;padding:9px;border-radius:10px;cursor:pointer;font:600 13px Arial,sans-serif}
        .drawer-language button.active{background:#e4f3e8;border-color:#a8d2b4;color:#17683c;font-weight:800}
      `}</style>
    </div>
  );
}
