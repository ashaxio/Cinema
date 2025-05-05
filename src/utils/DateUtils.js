export function formatDate(dateString) {
    const months = [
      'січня',
      'лютого',
      'березня',
      'квітня',
      'травня',
      'червня',
      'липня',
      'серпня',
      'вересня',
      'жовтня',
      'листопада',
      'грудня',
    ];
  
    const [year, month, day] = dateString.split('-');
    const monthName = months[parseInt(month, 10) - 1];
    return `${parseInt(day, 10)} ${monthName} ${year}р.`;
  }