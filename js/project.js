document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('project-form');
  if (!form) return;

  const options = [...form.querySelectorAll('input[type="checkbox"]')];
  const count = document.getElementById('selection-count');
  const error = document.getElementById('form-error');

  const updateCount = () => {
    const selected = options.filter(option => option.checked).length;
    count.textContent = selected;
    if (selected > 0) error.hidden = true;
  };

  options.forEach(option => option.addEventListener('change', updateCount));

  form.addEventListener('submit', event => {
    event.preventDefault();
    const selected = options.filter(option => option.checked);
    if (!selected.length) {
      error.hidden = false;
      options[0].focus();
      return;
    }

    const data = new FormData(form);
    const groups = new Map();
    selected.forEach(option => {
      if (!groups.has(option.name)) groups.set(option.name, []);
      groups.get(option.name).push(option.value);
    });

    const lines = [
      'Hola, soy ' + data.get('nombre') + '.',
      data.get('negocio') ? 'Mi negocio es: ' + data.get('negocio') + '.' : '',
      '',
      'Me interesa consultar por:'
    ];

    groups.forEach((items, group) => {
      lines.push('', '*' + group + '*');
      items.forEach(item => lines.push('• ' + item));
    });

    if (data.get('detalle')) {
      lines.push('', '*Situación actual / objetivo*', data.get('detalle'));
    }

    lines.push('', 'Quisiera que me orienten sobre cómo combinar estos servicios.');
    const message = lines.filter((line, index) => line !== '' || lines[index - 1] !== '').join('\n');
    window.open('https://wa.me/5491164562757?text=' + encodeURIComponent(message), '_blank', 'noopener');
  });
});
