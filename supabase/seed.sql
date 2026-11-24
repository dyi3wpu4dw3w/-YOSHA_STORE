-- Optional starter catalog taxonomy. Safe to run once after schema.sql.
insert into public.categories(name,slug) values
('الإلكترونيات','electronics'),('الأزياء','fashion'),('المنزل والمطبخ','home-kitchen'),('الجمال والعناية','beauty-care'),('الرياضة','sports'),('الأطفال','kids')
on conflict(slug) do nothing;
