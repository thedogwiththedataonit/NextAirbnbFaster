import { cookies } from "next/headers";
import { unstable_cache } from "./unstable-cache";
import clientPromise from '../mongodb/connect'

const revalidatePeriod = 1;

export const getCollectionNames = unstable_cache(
  async () => {
    try {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB) 
      
      // Get all collection names
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map(collection => collection.name);
      
      return collectionNames;
    } catch (error) {
      console.error("Error fetching collection names:", error);
      throw error;
    }
  },
  ["mongodb-collections"], // Cache key
  {
    revalidate: revalidatePeriod, // Revalidate every hour
  }
);
export const getCountOfAllDocuments = unstable_cache(
  //go through all collections and get the count of documents in each collection
  async () => {
    try {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB) 
      
      const collectionNames = await getCollectionNames();
      // Get the count of documents in each collection
      const counts = await Promise.all(collectionNames.map(async (collectionName) => {
        const collection = db.collection(collectionName);
        return collection.countDocuments();
      }));
      const totalCount = counts.reduce((acc, count) => acc + count, 0);

      console.log("Total document count:", totalCount);
      return totalCount;
    } catch (error) {
      console.error("Error fetching document counts:", error);
      throw error
    }
  },
  ["mongodb-document-counts"], // Cache key
  {
    revalidate: revalidatePeriod, // Revalidate every hour
  }
);

export const getDocumentsInCollection = unstable_cache(
  async (collectionName: string) => {
    try {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB) 
      
      const collection = db.collection(collectionName);
      const documents = await collection.find().toArray();
      //to each document, add the collection name
      documents.forEach(document => document.collection = collectionName);
      return documents;
    } catch (error) {
      console.error("Error fetching documents in collection:", error);
      throw error;
    }
  },
  ["mongodb-documents"], // Cache key
  {
    revalidate: revalidatePeriod, // Revalidate every hour
  } 
);

export const getDocumentById = unstable_cache(
  async (collectionName: string, bnbId: string) => {
    try {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB) 
      
      const collection = db.collection(collectionName);
      const document = await collection.findOne({ bnbId: bnbId });

      console.log(document);
      return document;
    }
    catch (error) {
      console.error("Error fetching document by ID:", error);
      throw error;
    }
  },
  ["mongodb-document-by-id"], // Cache key
  {
    revalidate: revalidatePeriod, // Revalidate every hour
  } 
);

export const getHighestRatedDocuments = unstable_cache(
  //go through all collections and get the 50 highest rated documents, for each document, add the collection name
  async () => {
    try {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB) 
      
      const collectionNames = await getCollectionNames();
      const highestRatedDocuments = await Promise.all(collectionNames.map(async (collectionName) => {
        const collection = db.collection(collectionName);
        const documents = await collection.find().sort({ rating: -1 }).limit(50).toArray();
        return documents.map(document => ({ ...document, collection: collectionName }));
      }));
      const flattenedDocuments = highestRatedDocuments.flat();
      return flattenedDocuments;
    } catch (error) {
      console.error("Error fetching highest rated documents:", error);
      throw error;
    }
  },
  ["mongodb-highest-rated-documents"], // Cache key
  {
    revalidate: revalidatePeriod, // Revalidate every hour
  }
);

export const getRelatedDocuments = unstable_cache(
  //randomly select 5 documents from the same collection
  async (collectionName: string, bnbId: string) => {
    try {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB) 
      
      const collection = db.collection(collectionName);
      const document = await collection.findOne({ bnbId: bnbId });
      const relatedDocuments = await collection.aggregate([
        { $match: { bnbId: { $ne: bnbId } } },
        { $sample: { size: 10 } }
      ]).toArray();
      return relatedDocuments;
    } catch (error) {
      console.error("Error fetching related documents:", error);
      throw error;
    }
  },
  ["mongodb-related-documents"], // Cache key
  {
    revalidate: revalidatePeriod, // Revalidate every hour
  }
);


/*
export async function getUser() {
  const sessionCookie = (await cookies()).get("session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== "number"
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export const getProductsForSubcategory = unstable_cache(
  (subcategorySlug: string) =>
    db.query.products.findMany({
      where: (products, { eq, and }) =>
        and(eq(products.subcategory_slug, subcategorySlug)),
      orderBy: (products, { asc }) => asc(products.slug),
    }),
  ["subcategory-products"],
  {
    revalidate: 60 * 60 * 2, // two hours,
  },
);

export const getProductDetails = unstable_cache(
  (productSlug: string) =>
    db.query.products.findFirst({
      where: (products, { eq }) => eq(products.slug, productSlug),
    }),
  ["product"],
  {
    revalidate: 60 * 60 * 2, // two hours,
  },
);

export const getSubcategory = unstable_cache(
  (subcategorySlug: string) =>
    db.query.subcategories.findFirst({
      where: (subcategories, { eq }) => eq(subcategories.slug, subcategorySlug),
    }),
  ["subcategory"],
  {
    revalidate: 60 * 60 * 2, // two hours,
  },
);

export const getCategory = unstable_cache(
  (categorySlug: string) =>
    db.query.categories.findFirst({
      where: (categories, { eq }) => eq(categories.slug, categorySlug),
      with: {
        subcollections: {
          with: {
            subcategories: true,
          },
        },
      },
    }),
  ["category"],
  {
    revalidate: 60 * 60 * 2, // two hours,
  },
);

export const getCollectionDetails = unstable_cache(
  async (collectionSlug: string) =>
    db.query.collections.findMany({
      with: {
        categories: true,
      },
      where: (collections, { eq }) => eq(collections.slug, collectionSlug),
      orderBy: (collections, { asc }) => asc(collections.slug),
    }),
  ["collection"],
  {
    revalidate: 60 * 60 * 2, // two hours,
  },
);

export const getProductCount = unstable_cache(
  () => db.select({ count: count() }).from(products),
  ["total-product-count"],
  {
    revalidate: 60 * 60 * 2, // two hours,
  },
);

// could be optimized by storing category slug on the products table
export const getCategoryProductCount = unstable_cache(
  (categorySlug: string) =>
    db
      .select({ count: count() })
      .from(categories)
      .leftJoin(
        subcollections,
        eq(categories.slug, subcollections.category_slug),
      )
      .leftJoin(
        subcategories,
        eq(subcollections.id, subcategories.subcollection_id),
      )
      .leftJoin(products, eq(subcategories.slug, products.subcategory_slug))
      .where(eq(categories.slug, categorySlug)),
  ["category-product-count"],
  {
    revalidate: 60 * 60 * 2, // two hours,
  },
);

export const getSubcategoryProductCount = unstable_cache(
  (subcategorySlug: string) =>
    db
      .select({ count: count() })
      .from(products)
      .where(eq(products.subcategory_slug, subcategorySlug)),
  ["subcategory-product-count"],
  {
    revalidate: 60 * 60 * 2, // two hours,
  },
);

export const getSearchResults = unstable_cache(
  async (searchTerm: string) => {
    let results;

    // do we really need to do this hybrid search pattern?

    if (searchTerm.length <= 2) {
      // If the search term is short (e.g., "W"), use ILIKE for prefix matching
      results = await db
        .select()
        .from(products)
        .where(sql`${products.name} ILIKE ${searchTerm + "%"}`) // Prefix match
        .limit(5)
        .innerJoin(
          subcategories,
          sql`${products.subcategory_slug} = ${subcategories.slug}`,
        )
        .innerJoin(
          subcollections,
          sql`${subcategories.subcollection_id} = ${subcollections.id}`,
        )
        .innerJoin(
          categories,
          sql`${subcollections.category_slug} = ${categories.slug}`,
        );
    } else {
      // For longer search terms, use full-text search with tsquery
      const formattedSearchTerm = searchTerm
        .split(" ")
        .filter((term) => term.trim() !== "") // Filter out empty terms
        .map((term) => `${term}:*`)
        .join(" & ");

      results = await db
        .select()
        .from(products)
        .where(
          sql`to_tsvector('english', ${products.name}) @@ to_tsquery('english', ${formattedSearchTerm})`,
        )
        .limit(5)
        .innerJoin(
          subcategories,
          sql`${products.subcategory_slug} = ${subcategories.slug}`,
        )
        .innerJoin(
          subcollections,
          sql`${subcategories.subcollection_id} = ${subcollections.id}`,
        )
        .innerJoin(
          categories,
          sql`${subcollections.category_slug} = ${categories.slug}`,
        );
    }

    return results;
  },
  ["search-results"],
  { revalidate: 60 * 60 * 2 }, // two hours
);
*/