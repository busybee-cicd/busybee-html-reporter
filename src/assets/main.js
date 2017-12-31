function showComparison(comparison, responsePart, id) {
  var compareBtns = document.getElementById('compareBtns-'+ responsePart + '-' + id).children;
  var diff = document.getElementById('diff-' + responsePart + '-' + id);
  var sideBySide = document.getElementById('sideBySide-' + responsePart + '-' + id);

  switch (comparison) {
    case 'sideBySide':
      sideBySide.style.display = 'block';
      diff.style.display = 'none';
      compareBtns[0].classList.add('active');
      compareBtns[1].classList.remove('active');
      break;
    case 'diff':
      diff.style.display = 'block';
      sideBySide.style.display = 'none';
      compareBtns[1].classList.add('active');
      compareBtns[0].classList.remove('active');
      break;
    default:
      break;
  }
}


