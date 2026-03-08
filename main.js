// // Exercice 1.1 

// console.log("Début");
// try {
//   // Provoque une erreur volontaire (mauvais JSON)
//   JSON.parse("{mauvais json}");
//   console.log("Cette ligne ne s'affichera pas");
// } catch (e) {
//   console.log("Erreur attrapée:", e.name, "-", e.message);
// }
// console.log("Suite du programme");

// // Exercice 1.2

// let ressourceOuverte = false;
// try {
//   ressourceOuverte = true;
//   console.log("Ressource ouverte");
//   throw new Error("Oups!");
// } catch (e) {
//   console.warn("On gère:", e.message);
// } finally {
//   ressourceOuverte = false; // nettoyage
//   console.log("Ressource refermée?", !ressourceOuverte);
// }


// ------------------------------------------------------------------------------------------------

// Exercice 2.1 — Valider des paramètres
// function additionSure(a, b) {
//   if (typeof a !== "number" || typeof b !== "number") {
//     throw new Error("additionSure: a et b doivent être des nombres");
//   }
//   return a + b;
// }

// try {
//   console.log(additionSure(2, 3)); // 5
//   console.log(additionSure("2", 3)); // va au catch
// } catch (e) {
//   console.error("Problème:", e.message);
// }

// // Exercice 2.2 — Petite erreur personnalisée (facultatif)

// class ValidationError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = "ValidationError";
//   }
// }

// function creerUtilisateur({ id, email }) {
//   if (!Number.isInteger(id) || id <= 0) throw new ValidationError("id doit être un entier positif");
//   if (typeof email !== "string" || !email.includes("@")) throw new ValidationError("email invalide");
//   return { id, email: email.trim() };
// }

// try {
//   creerUtilisateur({ id: 0, email: "a@b.com" });
// } catch (e) {
//   console.log(e.name, "-", e.message); // ValidationError - id doit être un entier positif
// }

// ------------------------------------------------------------------------------------------------
// function toInt(x, defaut = 0) {
//   return Number.isInteger(x) ? x : defaut;
// }

// console.log(toInt(5));      // 5
// console.log(toInt(5.2, 1)); // 1
// console.log(toInt("a", 0)); // 0

// const config = { db: { host: "localhost", port: 5432 } };
// const port = config?.db?.port ?? 3306; // si absent → 3306
// console.log("Port:", port);


// function ajouterProduit(liste, p) {
//   if (!p || typeof p.nom !== "string" || p.nom.trim() === "") {
//     throw new Error("Produit invalide: nom requis");
//   }
//   if (typeof p.prix !== "number" || p.prix < 0) {
//     throw new Error("Produit invalide: prix >= 0");
//   }
//   // On retourne une nouvelle liste, on ne modifie pas l’originale
//   return [...liste, { ...p }];
// }

// const produits = [];
// const nouvelleListe = ajouterProduit(produits, { nom: "Stylo", prix: 1.2 });
// console.log(produits === nouvelleListe); // false (pas la même référence)


// ----------------------------------------------------------------------
// Exercice 5.1 — Calculer une moyenne en toute sécurité
function moyenne(nums) {
  if (!Array.isArray(nums) || nums.length === 0) {
    throw new Error("moyenne: fournir un tableau non vide");
  }
  if (!nums.every(n => typeof n === "number" && Number.isFinite(n))) {
    throw new Error("moyenne: tous les éléments doivent être des nombres");
  }
  const total = nums.reduce((a, n) => a + n, 0);
  return total / nums.length;
}

try {
  console.log(moyenne([10, 12, 8])); // 10
  console.log(moyenne([10, "x", 8])); // catch
} catch (e) {
  console.warn(e.message);
}

// Exercice 5.2 — Lecture « sûre » d’un champ d’objet
function getSafe(obj, path, defaut) {
  try {
    return path.split(".").reduce((acc, k) => acc?.[k], obj) ?? defaut;
  } catch {
    return defaut;
  }
}

const data = { user: { profil: { nom: "Lina" } } };
console.log(getSafe(data, "user.profil.nom", "(inconnu)")); // "Lina"
console.log(getSafe(data, "user.adresse.ville", "(inconnue)")); // "(inconnue)"

// Exercice 5.3 — Retenter une fois (retry simple)

async function withRetryOnce(op) {
  try {
    return await op();
  } catch (e) {
    console.warn("Échec, on réessaie une fois...");
    return op(); // second essai (laissera l’erreur remonter si ça échoue encore)
  }
}

let tentative = 0;
const parfoisRate = () => new Promise((ok, ko) => setTimeout(() => (++tentative % 2 ? ko(new Error("raté")) : ok("réussi")), 100));

withRetryOnce(parfoisRate)
  .then(console.log)
  .catch(e => console.error("Toujours en échec:", e.message));