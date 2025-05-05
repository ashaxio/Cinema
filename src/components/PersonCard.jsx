const PersonCard = ({ name, photo, role }) => (
  <div className='flex-shrink-0 w-60 bg-gray-800 rounded-lg p-4 text-center'>
    <img
      src={photo}
      alt={name}
      className='w-full h-60 object-cover rounded mb-3'
    />
    <h3 className='text-lg font-semibold'>{name}</h3>
    <p className='text-sm text-white/70'>{role}</p>
  </div>
);

export default PersonCard;
