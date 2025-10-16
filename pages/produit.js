let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  // ✅ Ajouter produit au panier
  document.querySelectorAll('.produit-card button').forEach(btn => {
    btn.addEventListener('click', function () {
      const card = btn.closest('.produit-card');
      const name = card.querySelector('h3').textContent.trim();
      const priceText = card.querySelectorAll('p')[1].textContent;
      const price = parseInt(priceText.replace(/\D/g, ''));
      addToCart(name, price);
    });
  });

  // ✅ Boutons panier
  document.getElementById('btn-print').addEventListener('click', openClientForm);
  document.getElementById('btn-clear').addEventListener('click', clearCart);

  // ✅ Formulaire client
  document.getElementById('submit-form').addEventListener('click', confirmOrder);
  document.getElementById('close-form').addEventListener('click', closeClientForm);

  makeCartDraggable(); // panier déplaçable
});

// ======== GESTION PANIER ========
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById('cart-items');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartList.innerHTML = cart.map((item, i) =>
    `<li>
      <span>${item.name}</span>
      <div class="cart-controls">
        <button class="qty-btn" onclick="changeQty(${i}, -1)">➖</button>
        <span class="qty">${item.quantity}</span>
        <button class="qty-btn" onclick="changeQty(${i}, 1)">➕</button>
        <span class="price">${(item.price * item.quantity).toLocaleString()} </span>
        <button class="remove" onclick="removeItem(${i})">❌</button>
      </div>
    </li>`
  ).join('');
  document.getElementById('cart-total').textContent = total.toLocaleString();
}

function changeQty(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  updateCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

function clearCart() {
  cart = [];
  updateCart();
}

// ======== FORMULAIRE CLIENT ========
function openClientForm() {
  document.getElementById('client-form').classList.remove('hidden');
}

function closeClientForm() {
  document.getElementById('client-form').classList.add('hidden');
}

function confirmOrder() {
  const name = document.getElementById('client-name').value.trim();
  const phone = document.getElementById('client-phone').value.trim();
  const address = document.getElementById('client-address').value.trim();

  if (!name || !phone || !address) {
    alert("Merci de remplir toutes les informations du client.");
    return;
  }

  closeClientForm();
  printOrder(name, phone, address);
  clearCart();
}


// ======== IMPRESSION AVEC NUMÉRO DE COMMANDE ========
function printOrder(name, phone, address) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('fr-FR');
  
  // ✅ Générer un numéro de commande unique (ex : CMD-20251010-001)
  const orderNumber = `CMD-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 900 + 100)}`;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const printWindow = window.open('', '_blank');
  const content = `
  <html>
  <head>
    <title>Bon de commande - SenSolaire</title>
    <style>
      body {
        font-family: "Poppins", Arial, sans-serif;
        margin: 40px;
        color: #333;
        line-height: 1.6;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 2px solid #16a085;
        padding-bottom: 10px;
        margin-bottom: 25px;
      }

      .company-info {
        font-size: 14px;
        line-height: 1.5;
      }

      .company-info strong {
        color: #16a085;
        font-size: 18px;
      }

      .logo {
        width: 110px;
        height: auto;
      }

      h1 {
        text-align: center;
        color: #16a085;
        text-transform: uppercase;
        margin-bottom: 10px;
        letter-spacing: 1px;
      }

      .order-number {
        text-align: center;
        font-size: 15px;
        font-weight: bold;
        color: #333;
        margin-bottom: 25px;
      }

      .client-info {
        border: 2px solid #16a085;
        border-radius: 10px;
        background: #f8fffc;
        padding: 20px;
        margin-bottom: 25px;
      }

      .client-info h2 {
        color: #16a085;
        font-size: 17px;
        margin-bottom: 10px;
        text-transform: uppercase;
        border-bottom: 1px dashed #16a085;
        padding-bottom: 5px;
      }

      .client-info p {
        margin: 5px 0;
        font-size: 15px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
      }

      th, td {
        border: 1px solid #ddd;
        padding: 10px 12px;
        text-align: left;
      }

      th {
        background-color: #16a085;
        color: white;
        text-transform: uppercase;
        font-size: 14px;
      }

      td {
        font-size: 15px;
      }

      tfoot td {
        font-weight: bold;
        background-color: #f1f1f1;
      }
        /* ===== SIGNATURE ===== */
.signature-section {
  margin-top: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.signature-block {
  width: 35%;
  text-align: center;
}

.signature-block p {
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.signature-img {
  width: 200px;
  height: auto;
  object-fit: contain;
  border: none;
  background: transparent;
}


       /* ===== PIED DE PAGE ===== */
.footer {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: #444;
  font-family: "Poppins", Arial, sans-serif;
}

.footer-content {
  border-top: 2px solid #16a085;
  padding-top: 10px;
  width: 90%;
  margin: 0 auto;
}

.footer .thanks {
  font-size: 16px;
  color: #16a085;
  margin-bottom: 5px;
  font-weight: 600;
}

.footer .brand {
  font-size: 15px;
  margin-bottom: 4px;
}

.footer .infos {
  font-size: 13px;
  color: #666;
  letter-spacing: 0.3px;
}

    </style>
  </head>
  <body>
    <div class="header">
      <div class="company-info">
        <strong>SenSolaire</strong><br>
        Siège : Dakar, Sénégal<br>
        Téléphone : +221 76 258 56 06<br>
        Email : contact@sensolaire.sn<br>
        Date : ${dateStr}
        <div class="order-number">N° de commande : <strong>${orderNumber}</strong></div>

      </div>
      <img src="../images/logo.png" alt="Logo SenSolaire" class="logo">
    </div>

    <h1>BON DE COMMANDE</h1>

    <div class="client-info">
      <h2>Informations du client</h2>
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Téléphone :</strong> ${phone}</p>
      <p><strong>Adresse :</strong> ${address}</p>
    </div>

    <table>
      <thead>
        <tr>
          <th>Produit</th>
          <th>Quantité</th>
          <th>Prix unitaire</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${cart.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toLocaleString()} FCFA</td>
            <td>${(item.price * item.quantity).toLocaleString()} FCFA</td>
          </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">Total général</td>
          <td>${total.toLocaleString()} FCFA</td>
        </tr>
      </tfoot>
    </table>

   <div class="signature-section">
    <div class="signature-block">
     <img src="../images/signature.png" alt="Cachet et signature SenSolaire" class="signature-img">
    </div>
  </div>


    <div class="footer">
  <div class="footer-content">
     <p class="thanks">🌞 Merci pour votre confiance !</p>
     <p class="brand"><strong>SenSolaire</strong> — Énergie propre et durable</p>
     <p class="infos">
      <strong>NINEA :</strong> 006901236 &nbsp;&nbsp;|&nbsp;&nbsp;
      <strong>RCCM :</strong> SN.DKR.2018.A.17520
     </p>
    </div>
  </div>

  </body>
  </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();

  // ✅ Envoi vers WhatsApp avec numéro de commande inclus
  sendWhatsApp(name, phone, address, orderNumber);

  setTimeout(() => printWindow.print(), 800);
}

// ======== ENVOI WHATSAPP ========
function sendWhatsApp(name, phone, address, orderNumber) {
  const number = "221762585606";
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = cart.map(item => `- ${item.name} x${item.quantity} (${(item.price * item.quantity).toLocaleString()} FCFA)`).join('\n');

  const message = `
🧾 *Nouvelle commande SenSolaire*
-----------------------------------
📦 *N° de commande :* ${orderNumber}
👤 *Client :* ${name}
📞 *Téléphone :* ${phone}
📍 *Adresse :* ${address}

🛒 *Produits commandés :*
${order}

💰 *Total :* ${total.toLocaleString()} FCFA

Merci pour votre confiance 🌞
  `;

  const whatsappURL = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, '_blank');
}



// ======== PANIER FLOTTANT DÉPLAÇABLE ========
function makeCartDraggable() {
  const cart = document.getElementById('cart');
  const header = document.getElementById('cart-header'); // zone de drag
  let offsetX = 0, offsetY = 0, isDown = false;

  // ===== PC =====
  header.addEventListener('mousedown', e => {
    isDown = true;
    offsetX = e.clientX - cart.offsetLeft;
    offsetY = e.clientY - cart.offsetTop;
    cart.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', e => {
    if (!isDown) return;
    cart.style.left = (e.clientX - offsetX) + 'px';
    cart.style.top = (e.clientY - offsetY) + 'px';
  });

  document.addEventListener('mouseup', () => {
    isDown = false;
    cart.style.cursor = 'grab';
  });

  // ===== MOBILE =====
  header.addEventListener('touchstart', e => {
    isDown = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - cart.offsetLeft;
    offsetY = touch.clientY - cart.offsetTop;
  });

  document.addEventListener('touchmove', e => {
    if (!isDown) return;
    const touch = e.touches[0];
    cart.style.left = (touch.clientX - offsetX) + 'px';
    cart.style.top = (touch.clientY - offsetY) + 'px';
    e.preventDefault(); // empêche le scroll pendant le drag
  }, { passive: false });

  document.addEventListener('touchend', () => isDown = false);
}


// ======== MODALE PRODUIT AVANCÉE ========
document.addEventListener('DOMContentLoaded', () => {
  const modal               = document.getElementById('imageModal');
  const mainImg             = document.getElementById('modalMainImage');
  const modalName           = document.getElementById('modalProductName');
  const modalDesc           = document.getElementById('modalProductDescription');
  const modalPrice          = document.getElementById('modalProductPrice');
  const thumbnailsContainer = document.getElementById('modalThumbnails');
  const closeModal          = document.getElementById('closeImageModal');
  const prevBtn             = document.getElementById('prevImage');
  const nextBtn             = document.getElementById('nextImage');

  const productImages = {
    "Panneau Solaire 300W": [
      "../images/panneau.jpg",
      "../images/panneau1.jpg"
    ],
    "Onduleur 5kW": [
      "../images/onduleur.jpg",
      "../images/onduleur2.jpg"
    ],
    "Lampadaire Solaire 100W": [
      "../images/lampadaire.jpg",
      "../images/lampadaire2.jpg"
    ],
    "Projecteur Solaire LED 200W": [
      "../images/projecteur1.jpg",
      "../images/projecteur2.jpg"
    ],
    "Pompe solaire 500w": [
      "../images/pompe1.jpg",
      "../images/pompe.jpg"
    ]
  };

  let currentImages = [];
  let currentIndex = 0;

  // 🖼️ Ouvrir la modale au clic sur une image produit
  document.querySelectorAll('.produit-card img').forEach(img => {
    img.addEventListener('click', () => {
      const card  = img.closest('.produit-card');
      const name  = card.querySelector('h3').textContent.trim();
      const desc  = card.querySelectorAll('p')[0]?.textContent || "";
      const price = card.querySelectorAll('p')[1]?.textContent || "";

      modalName.textContent  = name;
      modalDesc.textContent  = desc;
      modalPrice.textContent = price;

      currentImages = productImages[name] || [img.src];
      currentIndex = 0;
      mainImg.src = currentImages[currentIndex];

      thumbnailsContainer.innerHTML = "";
      currentImages.forEach((src, i) => {
        const thumb = document.createElement("img");
        thumb.src = src;
        if (i === currentIndex) thumb.classList.add("active");
        thumb.addEventListener("click", () => {
          currentIndex = i;
          updateImage();
        });
        thumbnailsContainer.appendChild(thumb);
      });

      modal.classList.remove('hidden');
    });
  });

  // 🔁 Met à jour l'image principale
  function updateImage() {
    mainImg.src = currentImages[currentIndex];
    thumbnailsContainer.querySelectorAll("img").forEach((t, i) => {
      t.classList.toggle("active", i === currentIndex);
    });
  }

  // Flèches navigation
  prevBtn.addEventListener('click', e => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateImage();
  });

  nextBtn.addEventListener('click', e => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateImage();
  });

  // Fermer la modale
  closeModal.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  // Navigation clavier
  document.addEventListener('keydown', e => {
    if (modal.classList.contains('hidden')) return;
    if (e.key === "ArrowLeft") prevBtn.click();
    else if (e.key === "ArrowRight") nextBtn.click();
    else if (e.key === "Escape") modal.classList.add('hidden');
  });
});


// ======== FILTRE PRODUITS PAR CATÉGORIE ========
(function initProductFilter() {
  function run() {
    const sidebar = document.querySelector('.sidebar');
    const categoryLinks = document.querySelectorAll('.sidebar a[data-cat]');
    const products = document.querySelectorAll('.produit-card[data-cat]');
    if (!sidebar || !categoryLinks.length || !products.length) return;

    function applyFilter(cat) {
      let visibleCount = 0;
      products.forEach(prod => {
        const match = (cat === 'all' || prod.dataset.cat === cat);
        prod.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });

      // Met à jour le lien actif
      categoryLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.cat === cat);
        link.setAttribute('aria-current', link.dataset.cat === cat ? 'true' : 'false');
      });

      // Si aucun produit ne correspond
      const noRes = document.querySelector('.no-results');
      if (noRes) noRes.style.display = visibleCount ? 'none' : '';
    }

    // Événements de clic sur les liens de catégorie
    categoryLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const cat = (link.dataset.cat || 'all').trim();
        applyFilter(cat);

        // Mettre à jour le hash dans l'URL sans recharger
        try { history.replaceState(null, '', `#${cat}`); } catch {}
      });
    });

    // Appliquer la catégorie selon l’URL au chargement
    const urlCat = location.hash.replace('#', '') || new URLSearchParams(location.search).get('cat');
    if (urlCat) {
      const target = [...categoryLinks].find(l => l.dataset.cat === urlCat);
      if (target) target.click();
      else categoryLinks[0].click();
    } else {
      const init = sidebar.querySelector('a.active') || sidebar.querySelector('a[data-cat="all"]') || categoryLinks[0];
      if (init) init.click();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();


//Barre de recherche
document.getElementById('search-input').addEventListener('input', function() {
  const term = this.value.toLowerCase();
  document.querySelectorAll('.produit-card').forEach(card => {
    const name = card.querySelector('h3').textContent.toLowerCase();
    const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
    card.style.display = (name.includes(term) || desc.includes(term)) ? '' : 'none';
  });
});
