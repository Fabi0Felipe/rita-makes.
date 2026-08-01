-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- CATEGORIES
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text NOT NULL DEFAULT 'sparkles',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "categories admin write" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- PRODUCTS
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL DEFAULT '',
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  sale_price numeric(10,2),
  image_url text NOT NULL DEFAULT '',
  stock integer NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  sales_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX products_category_idx ON public.products(category_id);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "products admin write" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- STORE SETTINGS
CREATE TABLE public.store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name text NOT NULL DEFAULT 'Rita Makes',
  whatsapp text NOT NULL DEFAULT '',
  instagram text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  opening_hours text NOT NULL DEFAULT '',
  footer_note text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.store_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.store_settings TO authenticated;
GRANT ALL ON public.store_settings TO service_role;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.store_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings admin write" ON public.store_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER settings_updated_at BEFORE UPDATE ON public.store_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.store_settings (whatsapp, instagram, address, opening_hours, footer_note)
VALUES ('5584900000000', 'ritamakes', 'Alto do Rodrigues — RN', 'Seg a Sex: 8h às 18h | Sáb: 8h às 12h', 'Sua beleza merece os melhores produtos.');

INSERT INTO public.categories (name, slug, icon, sort_order) VALUES
('Batons','batons','lipstick',1),
('Bases','bases','droplet',2),
('Corretivos','corretivos','wand-2',3),
('Pós Faciais','pos-faciais','circle-dot',4),
('Blush','blush','flower-2',5),
('Iluminadores','iluminadores','sun',6),
('Contorno','contorno','triangle',7),
('Sombras','sombras','palette',8),
('Delineadores','delineadores','pen-line',9),
('Máscaras de Cílios','mascaras-de-cilios','eye',10),
('Lápis','lapis','pencil',11),
('Skincare','skincare','leaf',12),
('Acessórios','acessorios','brush',13),
('Kits','kits','gift',14);

INSERT INTO public.products (name, brand, category_id, description, price, sale_price, image_url, stock, is_featured, sales_count, created_at)
SELECT v.name, v.brand, c.id, v.description, v.price, v.sale_price, v.image_url, v.stock, v.is_featured, v.sales_count,
       now() - (v.age_days || ' days')::interval
FROM (VALUES
('Batom Matte Vermelho Escuro','Maybelline New York','batons','Alta pigmentação, acabamento matte e longa duração.',39.90,NULL,'/images/cat-batons.jpg',18,true,140,2),
('Batom Nude Matte','Ruby Rose','batons','Textura cremosa com acabamento aveludado.',24.90,19.90,'/images/cat-batons.jpg',30,true,210,3),
('Batom Líquido Rosé','Vult','batons','Cor intensa que não transfere.',29.90,NULL,'/images/cat-batons.jpg',22,false,95,10),
('Batom Cremoso Cereja','Avon','batons','Hidratação e brilho em um só produto.',34.90,NULL,'/images/cat-batons.jpg',14,false,60,25),
('Batom Bala Gloss','Bruna Tavares','batons','Efeito gloss com toque leve.',44.90,37.90,'/images/cat-batons.jpg',9,false,120,7),
('Batom Fosco Marsala','Mari Maria','batons','Tom marsala moderno e sofisticado.',42.90,NULL,'/images/cat-batons.jpg',12,true,88,4),
('Batom Longa Duração Nude Rosado','Dailus','batons','Até 12 horas de cor sem retoques.',27.90,NULL,'/images/cat-batons.jpg',26,false,70,40),
('Lip Tint Rosa','Vizzela','batons','Cor natural com efeito mordido.',26.90,21.90,'/images/cat-batons.jpg',35,false,180,6),
('Base Fit Me','Maybelline','bases','Cobertura média com acabamento natural.',74.90,NULL,'/images/cat-bases.jpg',16,true,230,1),
('Base Líquida HD','Vult','bases','Uniformiza a pele sem pesar.',48.90,NULL,'/images/cat-bases.jpg',20,false,140,12),
('Base Matte Alta Cobertura','Ruby Rose','bases','Controle de oleosidade por 10 horas.',35.90,29.90,'/images/cat-bases.jpg',24,false,160,5),
('Base Sérum Hidratante','Bruna Tavares','bases','Toque de pele com hidratação.',89.90,NULL,'/images/cat-bases.jpg',8,true,75,8),
('Base BT Skin','Bruna Tavares','bases','Acabamento natural e vegana.',94.90,NULL,'/images/cat-bases.jpg',6,false,54,30),
('Base Mari Maria Amêndoa','Mari Maria','bases','Cobertura buildable com efeito segunda pele.',79.90,69.90,'/images/cat-bases.jpg',11,true,190,9),
('BB Cream Multifuncional','L''Oréal Paris','bases','Cinco benefícios em um único produto.',56.90,NULL,'/images/cat-bases.jpg',13,false,66,45),
('Corretivo Líquido','Mari Maria','corretivos','Alta cobertura para olheiras.',42.90,NULL,'/images/cat-corretivos.jpg',19,true,205,2),
('Corretivo Instant Age','Maybelline','corretivos','Efeito antiolheiras imediato.',69.90,59.90,'/images/cat-corretivos.jpg',10,false,130,11),
('Corretivo Matte','Ruby Rose','corretivos','Acabamento seco e duradouro.',22.90,NULL,'/images/cat-corretivos.jpg',40,false,150,20),
('Corretivo em Bastão','Dailus','corretivos','Prático para retoques rápidos.',26.90,NULL,'/images/cat-corretivos.jpg',17,false,48,33),
('Corretivo Cobertura Total','Vult','corretivos','Disfarça manchas e imperfeições.',31.90,NULL,'/images/cat-corretivos.jpg',21,false,72,15),
('Pó Compacto','Dailus','pos-faciais','Controle da oleosidade.',31.90,NULL,'/images/cat-pos.jpg',28,false,110,3),
('Pó Solto Translúcido','Ruby Rose','pos-faciais','Selagem leve e invisível.',27.90,23.90,'/images/cat-pos.jpg',33,true,175,6),
('Pó Facial HD','Vult','pos-faciais','Acabamento aveludado sem craquelar.',36.90,NULL,'/images/cat-pos.jpg',15,false,90,18),
('Pó Banana','Mari Maria','pos-faciais','Ilumina a área dos olhos.',38.90,NULL,'/images/cat-pos.jpg',12,false,64,28),
('Pó Compacto Matte Longa Duração','Maybelline','pos-faciais','Pele sem brilho o dia inteiro.',54.90,NULL,'/images/cat-pos.jpg',9,false,58,50),
('Blush Compacto','Ruby Rose','blush','Pigmentação intensa e fácil aplicação.',22.90,NULL,'/images/cat-blush.jpg',31,true,240,1),
('Blush Cremoso Rosé','Bruna Tavares','blush','Efeito natural e luminoso.',49.90,42.90,'/images/cat-blush.jpg',13,true,160,4),
('Blush Duo','Vult','blush','Duas cores para compor o look.',32.90,NULL,'/images/cat-blush.jpg',18,false,88,14),
('Blush em Pó Pêssego','Dailus','blush','Cor delicada para o dia a dia.',24.90,NULL,'/images/cat-blush.jpg',26,false,77,22),
('Blush Líquido Cherry','Mari Maria','blush','Textura fluida de longa fixação.',44.90,NULL,'/images/cat-blush.jpg',10,false,52,9),
('Iluminador Glow','Bruna Tavares','iluminadores','Brilho sofisticado.',56.90,NULL,'/images/cat-iluminador.jpg',12,true,195,2),
('Iluminador Champagne','Ruby Rose','iluminadores','Partículas ultrafinas de brilho.',25.90,20.90,'/images/cat-iluminador.jpg',29,false,140,7),
('Iluminador Líquido','Vult','iluminadores','Pode ser misturado à base.',39.90,NULL,'/images/cat-iluminador.jpg',14,false,63,19),
('Iluminador Duo Pearl','Dailus','iluminadores','Dois tons perolados.',34.90,NULL,'/images/cat-iluminador.jpg',16,false,44,36),
('Contorno em Pó','Mari Maria','contorno','Sombra natural para esculpir o rosto.',39.90,NULL,'/images/cat-corretivos.jpg',15,false,97,5),
('Contorno Cremoso','Ruby Rose','contorno','Fácil de esfumar e modelar.',27.90,22.90,'/images/cat-corretivos.jpg',22,false,120,13),
('Bronzer Matte','Vult','contorno','Bronzeado natural e duradouro.',42.90,NULL,'/images/cat-corretivos.jpg',11,false,58,26),
('Paleta de Contorno 3 em 1','Luisance','contorno','Contorno, iluminador e blush.',36.90,NULL,'/images/cat-corretivos.jpg',13,false,70,32),
('Paleta de Sombras','Luisance','sombras','12 cores altamente pigmentadas.',39.90,NULL,'/images/cat-sombras.jpg',20,true,260,1),
('Paleta Nude 18 Cores','Ruby Rose','sombras','Tons neutros para todos os looks.',49.90,39.90,'/images/cat-sombras.jpg',17,true,220,3),
('Paleta Colorida Vibes','Vizzela','sombras','Cores vibrantes de alta fixação.',59.90,NULL,'/images/cat-sombras.jpg',9,false,84,16),
('Sombra Individual Cintilante','Dailus','sombras','Acabamento metálico intenso.',18.90,NULL,'/images/cat-sombras.jpg',37,false,66,24),
('Paleta Rose Gold','Mari Maria','sombras','Tons rosados e dourados.',69.90,NULL,'/images/cat-sombras.jpg',7,true,135,8),
('Delineador Líquido','Vizzela','delineadores','Ponta fina e secagem rápida.',29.90,NULL,'/images/cat-olhos.jpg',25,true,205,2),
('Delineador em Gel','Ruby Rose','delineadores','Preto intenso à prova d''água.',24.90,19.90,'/images/cat-olhos.jpg',28,false,150,10),
('Delineador Caneta','Vult','delineadores','Traço preciso sem falhas.',27.90,NULL,'/images/cat-olhos.jpg',19,false,92,21),
('Delineador Colorido Azul','Dailus','delineadores','Toque de cor no olhar.',22.90,NULL,'/images/cat-olhos.jpg',16,false,38,42),
('Máscara de Cílios Sky High','Maybelline','mascaras-de-cilios','Volume e alongamento.',79.90,NULL,'/images/cat-olhos.jpg',14,true,280,1),
('Máscara à Prova D''água','L''Oréal Paris','mascaras-de-cilios','Resistente à água e ao suor.',64.90,54.90,'/images/cat-olhos.jpg',11,false,170,6),
('Máscara Volume Extra','Ruby Rose','mascaras-de-cilios','Cílios volumosos em poucas camadas.',26.90,NULL,'/images/cat-olhos.jpg',30,false,120,17),
('Máscara Alongadora','Vult','mascaras-de-cilios','Efeito cílios postiços.',34.90,NULL,'/images/cat-olhos.jpg',21,false,88,27),
('Máscara Curvex Effect','Dailus','mascaras-de-cilios','Curvatura duradoura.',29.90,NULL,'/images/cat-olhos.jpg',18,false,54,38),
('Lápis de Olho Preto','Vult','lapis','Textura macia e alta fixação.',16.90,NULL,'/images/cat-olhos.jpg',44,false,190,4),
('Lápis para Sobrancelha','Ruby Rose','lapis','Preenche falhas com naturalidade.',19.90,14.90,'/images/cat-olhos.jpg',38,true,230,9),
('Lápis Retrátil Marrom','Dailus','lapis','Não precisa de apontador.',22.90,NULL,'/images/cat-olhos.jpg',27,false,74,23),
('Lápis de Boca Nude','Mari Maria','lapis','Contorna e prolonga a duração do batom.',24.90,NULL,'/images/cat-batons.jpg',20,false,66,31),
('Água Micelar','L''Oréal Paris','skincare','Limpeza profunda da pele.',34.90,NULL,'/images/cat-skincare.jpg',24,true,215,2),
('Sérum Facial','Principia','skincare','Hidratação intensa.',59.90,NULL,'/images/cat-skincare.jpg',13,true,140,5),
('Gel de Limpeza Facial','Neutrogena','skincare','Remove impurezas sem ressecar.',39.90,32.90,'/images/cat-skincare.jpg',18,false,120,12),
('Protetor Solar Facial FPS 60','La Roche-Posay','skincare','Toque seco com cor.',89.90,NULL,'/images/cat-skincare.jpg',10,false,98,20),
('Hidratante Facial Diário','Nivea','skincare','Leve e de rápida absorção.',29.90,NULL,'/images/cat-skincare.jpg',22,false,86,29),
('Sérum de Vitamina C','Principia','skincare','Uniformiza o tom da pele.',74.90,64.90,'/images/cat-skincare.jpg',9,true,110,7),
('Tônico Facial Calmante','Simple Organic','skincare','Prepara a pele para a maquiagem.',49.90,NULL,'/images/cat-skincare.jpg',12,false,42,44),
('Kit de Pincéis','Macrilan','acessorios','Kit com 12 pincéis profissionais.',89.90,NULL,'/images/cat-acessorios.jpg',15,true,250,3),
('Esponja de Maquiagem','Océane','acessorios','Aplicação uniforme da base.',19.90,14.90,'/images/cat-acessorios.jpg',48,false,300,6),
('Necessaire Rosé','Rita Makes','acessorios','Espaçosa e resistente à água.',44.90,NULL,'/images/cat-acessorios.jpg',10,false,58,35),
('Curvador de Cílios','Klass Vough','acessorios','Curvatura perfeita sem machucar.',24.90,NULL,'/images/cat-acessorios.jpg',26,false,92,18),
('Espelho de Bolsa com LED','Rita Makes','acessorios','Iluminação ideal para retoques.',39.90,NULL,'/images/cat-acessorios.jpg',14,false,47,11),
('Kit Maquiagem Completa','Ruby Rose','kits','Base, pó, blush, sombras e batom.',149.90,129.90,'/images/cat-acessorios.jpg',7,true,180,1),
('Kit Olhar Marcante','Vizzela','kits','Máscara, delineador e paleta de sombras.',119.90,NULL,'/images/cat-sombras.jpg',8,true,95,4),
('Kit Skincare Essencial','Principia','kits','Limpeza, sérum e hidratante.',179.90,159.90,'/images/cat-skincare.jpg',6,false,72,13),
('Kit Presente Rosé','Rita Makes','kits','Seleção especial para presentear.',199.90,NULL,'/images/cat-acessorios.jpg',5,true,60,2)
) AS v(name, brand, cat_slug, description, price, sale_price, image_url, stock, is_featured, sales_count, age_days)
JOIN public.categories c ON c.slug = v.cat_slug;