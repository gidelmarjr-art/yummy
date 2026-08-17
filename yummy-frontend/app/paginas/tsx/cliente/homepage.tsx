import Image from "next/image";
import logoYummy from "@/app/imagens/LogoYummy.png";
import styles from "@/app/paginas/css/cliente/homepage.module.css";

const categories = ["Comidas", "Comidas", "Comidas", "Comidas", "Comidas"];

const products = Array(4).fill({
  id: 1,
  name: "Comida 1",
  description: "Uma deliciosa porção de batata frita com queijo cheddar",
  price: "R$14,49",
  image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop",
});

export default function MenuPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoWrapper}>
          <Image
            src={logoYummy}
            alt="Yummy Logo"
            fill
            className={styles.objectContain}
            priority
          />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.bannerContainer}>
          <div className={styles.bannerImageWrapper}>
            <Image
              src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=1200&auto=format&fit=crop"
              alt="Burgers Banner"
              fill
              className={styles.objectCover}
              priority
            />
          </div>

          <div className={styles.storeInfo}>
            <div className={styles.avatarWrapper}>
              <Image
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop"
                alt="Foto do Restaurante"
                fill
                className={styles.objectCover}
              />
            </div>
            <div className={styles.storeDetails}>
              <h1 className={styles.storeTitle}>Codó burger</h1>
              <p className={styles.storeAddress}>Setor leste, quadra 42, lote 01</p>
            </div>
          </div>
        </div>

        <div className={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <button key={index} className={styles.categoryButton}>
              {category}
            </button>
          ))}
        </div>
        <section>
          <h2 className={styles.sectionTitle}>Mais pedidos</h2>

          <div className={styles.productsGrid}>
            {products.map((item, index) => (
              <div key={index} className={styles.productCard}>
                <div>
                  <div className={styles.productImageWrapper}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className={styles.objectCover}
                    />
                  </div>

                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{item.name}</h3>
                    <p className={styles.productDescription}>{item.description}</p>
                  </div>
                </div>

                <div className={styles.productFooter}>
                  <span className={styles.productPrice}>{item.price}</span>
                  <button className={styles.addButton}>+</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.moreButtonContainer}>
          <button className={styles.moreButton}>Ver mais</button>
        </div>
      </main>
    </div>
  );
}