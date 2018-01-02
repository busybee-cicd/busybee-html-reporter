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

function showRequest(comparison, id) {
  var requestBtns = document.getElementById('requestBtns-'+ id).children;
  var pretty = document.getElementById('request-pretty-' + id);
  var raw = document.getElementById('request-raw-' + id);

  switch (comparison) {
    case 'pretty':
      pretty.style.display = 'block';
      raw.style.display = 'none';
      requestBtns[0].classList.add('active');
      requestBtns[1].classList.remove('active');
      break;
    case 'raw':
      raw.style.display = 'block';
      pretty.style.display = 'none';
      requestBtns[1].classList.add('active');
      requestBtns[0].classList.remove('active');
      break;
    default:
      break;
  }
}


