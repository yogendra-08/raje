import Image from 'next/image';

const books = [
  { name: 'The Life of Chhatrapati Shivaji Maharaj', file: 'the_life_of_shivaji_maharaj.jpg' },
  { name: 'The Maratha Centure', file: 'the_maratha_centure.jpg' },
  { name: 'The Life and Death of Chhatrapati Sambhaji Maharaj', file: 'the_life_and_death_of_shambaji_maharaj.jpg' },
];

export default function BookGallery() {
  return (
    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', margin: '2rem 0' }}>
      {books.map((book) => (
        <div key={book.file} style={{ textAlign: 'center' }}>
          <Image
            src={`/book-images/${book.file}`}
            alt={book.name}
            width={200}
            height={300}
            style={{ objectFit: 'cover', borderRadius: '8px' }}
          />
          <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>{book.name}</div>
        </div>
      ))}
    </div>
  );
} 