USE what_the_dog;

-- Insertion pour la table Localite
-- -----------------------------------------------------
INSERT INTO Locality (name, postal_code, toponym, canton_code, language_code) VALUES
('Yverdon-les-Bains', 1400, 'Centre', 'VD', 'fr'),
('Lausanne', 1000, 'Gare', 'VD', 'fr'),
('Zurich', 8001, 'Altstadt', 'ZH', 'de');

-- Insertion pour la table Service
-- -----------------------------------------------------
INSERT INTO Service (date, place, duration_service) VALUES
('2025-11-10', 'Parc des Bains', '2025-11-10 14:00:00'),
('2025-11-12', 'Vieux-Lausanne', '2025-11-12 10:30:00'),
('2025-11-15', 'Forêt de Juriens', '2025-11-15 16:00:00');

-- Insertion pour la table Race
-- -----------------------------------------------------
INSERT INTO Race (name, category, morphotype, classification, sizeMin_F, sizeMax_F, sizeMin_M, sizeMax_M, weightMin_F, weightMax_F, weightMin_M, weightMax_M, life_expectancy) VALUES
('Berger Allemand', 'Berger', 'Médioligne', 'FCI 1', 55, 60, 60, 65, 22, 32, 30, 40, 11),  -- idRace 1
('Chihuahua', 'Nain', 'Bréviligne', 'FCI 9', 15, 20, 15, 20, 1, 3, 1, 3, 15),         -- idRace 2
('Labrador Retriever', 'Rapporteur', 'Médioligne', 'FCI 8', 54, 56, 56, 57, 25, 32, 29, 36, 12); -- idRace 3

-- Insertion pour la table Customer
-- -----------------------------------------------------
INSERT INTO Customer (lastname, firstname, gender, email, tel_number, postal_address, Locality_idLocality, Service_idService) VALUES
('Simond', 'Anthony', 'Masculin', 'anthony.simond@mail.ch', '0791234567', 'Rue de l\'Eglise 12', 1, 1), -- idCustomer 1 (Yverdon, Service 1)
('Achouri', 'Mouldi', 'Masculin', 'mouldi.achouri@mail.ch', '0789876543', 'Avenue de la Gare 5', 2, 2),   -- idCustomer 2 (Lausanne, Service 2)
('Plancherel', 'Pang', 'Masculin', 'pang.plancherel@mail.de', '0771122334', 'Bahnhofstrasse 3', 3, 3); -- idCustomer 3 (Zurich, Service 3)

-- Insertion pour la table dog
-- -----------------------------------------------------
INSERT INTO dog (firstname, sex, crossing, birthdate, dead, sterilized, Customer_idCustomer, Race_idRace) VALUES
('Rex', 'Male', 0, '2020-05-15', 0, 1, 1, 1),  -- iddog 1 (Anthony, Berger Allemand, stérilisé)
('Tobby', 'Male', 1, '2023-01-20', 0, 0, 1, 3), -- iddog 2 (Anthony, Croisé Labrador, non stérilisé)
('Bella', 'Femelle', 0, '2018-11-01', 0, 1, 2, 2), -- iddog 3 (Mouldi, Chihuahua, stérilisé)
('Shadow', 'Male', 0, '2015-03-10', 1, 1, 3, 1); -- iddog 4 (Pang, Berger Allemand, DÉCÉDÉ)

-- Insertion pour la table Illness
-- -----------------------------------------------------
INSERT INTO Illness (name, description, symptoms, means, remedy, vaccine, zoonosis) VALUES
('Dysplasie de la hanche', 'Malformation de l'articulation', 'Boiterie, difficulté à se lever', 'Radiographie', 'Chirurgie ou anti-inflammatoires', 0, 0), -- idillness 1
('Gale', 'Maladie de la peau causée par des acariens', 'Démangeaisons intenses, perte de poils', 'Test cutané', 'Traitements acaricides', 0, 1),       -- idillness 2
('Maladie de Lyme', 'Maladie bactérienne transmise par les tiques', 'Fièvre, léthargie, douleurs articulaires', 'Test sanguin', 'Antibiotiques', 1, 1);  -- idillness 3

-- Insertion pour la table dog_has_Illness
-- -----------------------------------------------------
-- Rex (iddog 1) a la Dysplasie de la hanche (idillness 1)
INSERT INTO dog_has_Illness (dog_iddog, Illness_idillness) VALUES
(1, 1);

-- Tobby (iddog 2) a la Gale (idillness 2) et la Maladie de Lyme (idillness 3)
INSERT INTO dog_has_Illness (dog_iddog, Illness_idillness) VALUES
(2, 2),
(2, 3);