# Back-end

Ενδεικτικά περιεχόμενα:

- Πηγαίος κώδικας εφαρμογής για εισαγωγή, διαχείριση και
  πρόσβαση σε δεδομένα (back-end).
- Database dump (sql ή json)
- Back-end functional tests.
- Back-end unit tests.
- RESTful API.

USE CASES:
1. [DONE]Πιστοποιηση ταυτοτητας χρηστη
2. [DONE]Υπολογισμός προφιλ χρηστη με βαση τις ταινιες που αυτος έχει κάνει like. Πχ στο προφιλ αρεσουν 20% ταινιες δρασης, 15% θριλερ, 40% κωμωδίες κτλ.
3. [DONE]Προσθήκη "like" ή "dislike" σε ταινίες
4. [DONE] Εύρεση της πιο high rated ταινίας του κάθε ηθοποιού / συντελεστή
5. [DONE] Εύρεση της πιο πρόσφατης ταινίας του κάθε ηθοποιού / συντελεστή
6. [DONE] Να βγάζει λίστα με τις Ν πιό high rated ταινίες του κάθε ηθοποιού / συντελεστή 
7. [DONE] Επιλογή των Ν ταινιών με τα καλύτερα ratings για ένα είδος (genre)
8. [DONE] Αναζητηση ταινιων με κριτηρια ηθοποιών / συντελεστών
9. [DONE] Αναζητηση ταινιων με κριτηρια είδους 
10. [NOT NEEDED]Διαπιστευση χρηστων
11. [DONE] Όταν επιλέγουμε ηθοποιό / συντελεστή να εμφανίζεται το βιογραφικό του.

not DONE:

- logout sta backend/routes [DONE] => ο κώδικας είναι κάτω κάτω στο login.routes.js και επίσης στο profile.html

- login ->prepei na apothikeuetai o user meta apo login [DONE] => γίνεται με δημιουργία session, για όσο ο χρήστης παραμένει συνδεδεμένος. Από το session έχουμε διαθέσιμα τα username και user_id, για να κάνουμε τα υπόλοιπα database quests

- koumpi login ->logout apo to layout.html [DONE]

- search me to title ->xreiazetai olo to title???? 

- genika allagi fakelon database ...[DONE] => διορθώθηκαν λίγο τα tables σε users και προστέθηκαν τα κτάλληλα tables για τα like dislikes

- CLI tests
- [DONE] Postman tests 

APIS 
- api 10 & 11 endpoints -> proairetika
- [DONE] title.js -> titleobject
- [DONE] "/" sta objects na bgoun 
