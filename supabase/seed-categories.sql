-- Run once in Supabase SQL Editor to populate the YOSHA marketplace categories.
insert into public.categories (name, slug, active) values
('ملابس رجالية','mens-fashion',true),
('ملابس نسائية','womens-fashion',true),
('الأحذية والحقائب','shoes-bags',true),
('الهواتف والإلكترونيات','electronics',true),
('الكمبيوتر والألعاب','computers-gaming',true),
('المنزل والمطبخ','home-kitchen',true),
('الجمال والعناية','beauty-care',true),
('الأطفال والألعاب','kids-toys',true),
('الرياضة واللياقة','sports-fitness',true),
('الساعات والإكسسوارات','watches-accessories',true),
('السيارات وقطع الغيار','auto-parts',true),
('الكتب والمستلزمات','books-stationery',true)
on conflict (slug) do update set name=excluded.name, active=true;
