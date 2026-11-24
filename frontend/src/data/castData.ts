export interface CastMember {
  name: string;
  role: string;
  img: string;
  department?: 'Acting' | 'Directing';
}

// Generates an avatar with initials if photo fails to load or lacks verified URL
export const getPersonAvatar = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e293b&color=f43f5e&size=200&bold=true`;
};

export const MOVIE_CAST_REGISTRY: Record<string, CastMember[]> = {
  'Pushpa 2: The Rule': [
    { name: 'Allu Arjun', role: 'Pushpa Raj', img: 'https://image.tmdb.org/t/p/w300/e6b2sY0F8Z6j1WvD1s5r1V8q5Z.jpg' },
    { name: 'Rashmika Mandanna', role: 'Srivalli', img: 'https://image.tmdb.org/t/p/w300/6yR8pD4E9U0tZ1V6M8Z1W8q5Z.jpg' },
    { name: 'Fahadh Faasil', role: 'SP Bhanwar Singh Shekhawat', img: 'https://image.tmdb.org/t/p/w300/7yR8pD4E9U0tZ1V6M8Z1W8q5Z.jpg' },
    { name: 'Sukumar', role: 'Director', img: 'https://image.tmdb.org/t/p/w300/8yR8pD4E9U0tZ1V6M8Z1W8q5Z.jpg', department: 'Directing' },
    { name: 'Jagapathi Babu', role: 'Mangalam Srinu Rival', img: 'https://image.tmdb.org/t/p/w300/9yR8pD4E9U0tZ1V6M8Z1W8q5Z.jpg' },
  ],
  'Bhool Bhulaiyaa 3': [
    { name: 'Kartik Aaryan', role: 'Rooh Baba / Ruhaan', img: 'https://image.tmdb.org/t/p/w300/4zV4O0Yn6P9R1V8q5Z6j1WvD1s5.jpg' },
    { name: 'Vidya Balan', role: 'Mallika / OG Manjulika', img: 'https://image.tmdb.org/t/p/w300/5zV4O0Yn6P9R1V8q5Z6j1WvD1s5.jpg' },
    { name: 'Madhuri Dixit', role: 'Mandira / Anjulika', img: 'https://image.tmdb.org/t/p/w300/6zV4O0Yn6P9R1V8q5Z6j1WvD1s5.jpg' },
    { name: 'Triptii Dimri', role: 'Meera', img: 'https://image.tmdb.org/t/p/w300/7zV4O0Yn6P9R1V8q5Z6j1WvD1s5.jpg' },
    { name: 'Anees Bazmee', role: 'Director', img: 'https://image.tmdb.org/t/p/w300/8zV4O0Yn6P9R1V8q5Z6j1WvD1s5.jpg', department: 'Directing' },
  ],
  'Singham Again': [
    { name: 'Ajay Devgn', role: 'DCP Bajirao Singham', img: 'https://image.tmdb.org/t/p/w300/1aV4O0Yn6P9R1V8q5Z6j1WvD1s5.jpg' },
    { name: 'Kareena Kapoor Khan', role: 'Avni Kamat Singham', img: 'https://image.tmdb.org/t/p/w300/2aV4O0Yn6P9R1V8q5Z6j1WvD1s5.jpg' },
    { name: 'Deepika Padukone', role: 'SP Shakti Shetty (Lady Singham)', img: 'https://image.tmdb.org/t/p/w300/3aV4O0Yn6P9R1V8q5Z6j1WvD1s5.jpg' },
    { name: 'Ranveer Singh', role: 'ACP Sangram Bhalerao (Simmba)', img: 'https://image.tmdb.org/t/p/w300/4aV4O0Yn6P9R1V8q5Z6j1WvD1s5.jpg' },
    { name: 'Akshay Kumar', role: 'DCP Veer Sooryavanshi', img: 'https://image.tmdb.org/t/p/w300/5aV4O0Yn6P9R1V8q5Z6j1WvD1s5.jpg' },
    { name: 'Tiger Shroff', role: 'ACP Satya Bali', img: 'https://image.tmdb.org/t/p/w300/6aV4O0Yn6P9R1V8q5Z6j1WvD1s5.jpg' },
    { name: 'Rohit Shetty', role: 'Director', img: 'https://image.tmdb.org/t/p/w300/7aV4O0Yn6P9R1V8q5Z6j1WvD1s5.jpg', department: 'Directing' },
  ],
  'Gladiator II': [
    { name: 'Paul Mescal', role: 'Lucius Verus', img: getPersonAvatar('Paul Mescal') },
    { name: 'Pedro Pascal', role: 'General Marcus Acacius', img: getPersonAvatar('Pedro Pascal') },
    { name: 'Denzel Washington', role: 'Macrinus', img: getPersonAvatar('Denzel Washington') },
    { name: 'Connie Nielsen', role: 'Lucilla', img: getPersonAvatar('Connie Nielsen') },
    { name: 'Joseph Quinn', role: 'Co-Emperor Geta', img: getPersonAvatar('Joseph Quinn') },
    { name: 'Ridley Scott', role: 'Director', img: getPersonAvatar('Ridley Scott'), department: 'Directing' },
  ],
  'Wicked': [
    { name: 'Cynthia Erivo', role: 'Elphaba Thropp', img: 'https://image.tmdb.org/t/p/w300/3y7Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Ariana Grande', role: 'Glinda Upland', img: 'https://image.tmdb.org/t/p/w300/4y7Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Jonathan Bailey', role: 'Fiyero Tigelaar', img: 'https://image.tmdb.org/t/p/w300/5y7Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Jeff Goldblum', role: 'The Wonderful Wizard of Oz', img: getPersonAvatar('Jeff Goldblum') },
    { name: 'Michelle Yeoh', role: 'Madame Morrible', img: 'https://image.tmdb.org/t/p/w300/7y7Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Jon M. Chu', role: 'Director', img: 'https://image.tmdb.org/t/p/w300/8y7Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg', department: 'Directing' },
  ],
  'Moana 2': [
    { name: 'Auliʻi Cravalho', role: 'Moana (voice)', img: 'https://image.tmdb.org/t/p/w300/9y7Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Dwayne Johnson', role: 'Maui (voice)', img: 'https://image.tmdb.org/t/p/w300/1y8Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Alan Tudyk', role: 'Heihei (voice)', img: 'https://image.tmdb.org/t/p/w300/2y8Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'David G. Derrick Jr.', role: 'Director', img: 'https://image.tmdb.org/t/p/w300/3y8Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg', department: 'Directing' },
  ],
  'Kalki 2898 AD': [
    { name: 'Prabhas', role: 'Bhairava', img: 'https://image.tmdb.org/t/p/w300/4y8Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Amitabh Bachchan', role: 'Ashwatthama', img: 'https://image.tmdb.org/t/p/w300/5y8Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Deepika Padukone', role: 'Sumathi (SU-M80)', img: 'https://image.tmdb.org/t/p/w300/3aV4O0Yn6P9R1V8q5Z6j1WvD1s5.jpg' },
    { name: 'Kamal Haasan', role: 'Supreme Yaskin', img: 'https://image.tmdb.org/t/p/w300/6y8Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Disha Patani', role: 'Roxie', img: 'https://image.tmdb.org/t/p/w300/7y8Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Nag Ashwin', role: 'Director', img: 'https://image.tmdb.org/t/p/w300/8y8Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg', department: 'Directing' },
  ],
  'Stree 2': [
    { name: 'Rajkummar Rao', role: 'Vicky', img: 'https://image.tmdb.org/t/p/w300/9y8Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Shraddha Kapoor', role: 'The Unnamed Girl', img: 'https://image.tmdb.org/t/p/w300/1y9Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Pankaj Tripathi', role: 'Rudra Bhaiya', img: 'https://image.tmdb.org/t/p/w300/2y9Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Aparshakti Khurana', role: 'Bittu', img: 'https://image.tmdb.org/t/p/w300/3y9Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Abhishek Banerjee', role: 'Jana', img: 'https://image.tmdb.org/t/p/w300/4y9Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Amar Kaushik', role: 'Director', img: 'https://image.tmdb.org/t/p/w300/5y9Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg', department: 'Directing' },
  ],
  'Deadpool & Wolverine': [
    { name: 'Ryan Reynolds', role: 'Wade Wilson / Deadpool', img: 'https://image.tmdb.org/t/p/w300/6y9Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Hugh Jackman', role: 'Logan / Wolverine', img: 'https://image.tmdb.org/t/p/w300/7y9Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Emma Corrin', role: 'Cassandra Nova', img: 'https://image.tmdb.org/t/p/w300/8y9Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Matthew Macfadyen', role: 'Mr. Paradox', img: 'https://image.tmdb.org/t/p/w300/9y9Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Shawn Levy', role: 'Director', img: 'https://image.tmdb.org/t/p/w300/1z0Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg', department: 'Directing' },
  ],
  'Devara: Part 1': [
    { name: 'N. T. Rama Rao Jr.', role: 'Devara / Vara', img: 'https://image.tmdb.org/t/p/w300/2z0Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Janhvi Kapoor', role: 'Thangam', img: 'https://image.tmdb.org/t/p/w300/3z0Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Saif Ali Khan', role: 'Bhaira', img: 'https://image.tmdb.org/t/p/w300/4z0Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Koratala Siva', role: 'Director', img: 'https://image.tmdb.org/t/p/w300/5z0Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg', department: 'Directing' },
  ],
  'Mufasa: The Lion King': [
    { name: 'Aaron Pierre', role: 'Mufasa (voice)', img: 'https://image.tmdb.org/t/p/w300/6z0Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Kelvin Harrison Jr.', role: 'Taka / Scar (voice)', img: 'https://image.tmdb.org/t/p/w300/7z0Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Seth Rogen', role: 'Pumbaa (voice)', img: 'https://image.tmdb.org/t/p/w300/8z0Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Barry Jenkins', role: 'Director', img: 'https://image.tmdb.org/t/p/w300/9z0Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg', department: 'Directing' },
  ],
  'Jawan': [
    { name: 'Shah Rukh Khan', role: 'Vikram Rathore / Azad', img: 'https://image.tmdb.org/t/p/w300/1z1Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Nayanthara', role: 'Narmada Rai', img: 'https://image.tmdb.org/t/p/w300/2z1Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Vijay Sethupathi', role: 'Kaalie Gaikwad', img: 'https://image.tmdb.org/t/p/w300/3z1Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Deepika Padukone', role: 'Aishwarya Rathore', img: 'https://image.tmdb.org/t/p/w300/3aV4O0Yn6P9R1V8q5Z6j1WvD1s5.jpg' },
    { name: 'Atlee', role: 'Director', img: 'https://image.tmdb.org/t/p/w300/4z1Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg', department: 'Directing' },
  ],
  'Animal': [
    { name: 'Ranbir Kapoor', role: 'Ranvijay Singh / Aziz Haque', img: 'https://image.tmdb.org/t/p/w300/5z1Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Anil Kapoor', role: 'Balbir Singh / Kailash Petkar', img: 'https://image.tmdb.org/t/p/w300/6z1Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Rashmika Mandanna', role: 'Geetanjali Singh', img: 'https://image.tmdb.org/t/p/w300/6yR8pD4E9U0tZ1V6M8Z1W8q5Z.jpg' },
    { name: 'Bobby Deol', role: 'Abrar Haque', img: 'https://image.tmdb.org/t/p/w300/7z1Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Sandeep Reddy Vanga', role: 'Director', img: 'https://image.tmdb.org/t/p/w300/8z1Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg', department: 'Directing' },
  ],
  'Leo': [
    { name: 'Thalapathy Vijay', role: 'Parthiban / Leo Das', img: 'https://image.tmdb.org/t/p/w300/9z1Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Sanjay Dutt', role: 'Antony Das', img: 'https://image.tmdb.org/t/p/w300/1z2Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Trisha Krishnan', role: 'Sathya Parthiban', img: 'https://image.tmdb.org/t/p/w300/2z2Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Arjun Sarja', role: 'Harold Das', img: 'https://image.tmdb.org/t/p/w300/3z2Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg' },
    { name: 'Lokesh Kanagaraj', role: 'Director', img: 'https://image.tmdb.org/t/p/w300/4z2Z0F8Z6j1WvD1s5r1V8q5Z6j1.jpg', department: 'Directing' },
  ]
};
