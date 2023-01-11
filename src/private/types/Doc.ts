import * as admin from "firebase-admin";

export interface FirebaseDoc {
    date: admin.firestore.Timestamp;
}