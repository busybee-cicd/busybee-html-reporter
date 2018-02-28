var expandedTest;

function expandTest(id) {
  console.log('expandTest');
  // tear down the previously expanded test;
  if (expandedTest) {
    closeTest(expandedTest);
    if (id == expandedTest) {
      expandedTest = null;
      return; // then collapsed the test that was open without opening another.
    }

  }

  expandedTest = id;
  if (window['createSideBySideLeftstatus'+id]) {
    window['createSideBySideLeftstatus'+id]();
    window['createSideBySideRightstatus'+id]();
  }
  if (window['createSideBySideLeftheaders'+id]) {
    window['createSideBySideLeftheaders'+id]();
    window['createSideBySideRightheaders'+id]();
  }
  if (window['createSideBySideLeftbody'+id]) {
    window['createSideBySideLeftbody'+id]();
    window['createSideBySideRightbody'+id]();
  }
}

function closeTest(id) {
  $('#'+expandedTest).collapse('hide');
  if (window['removeSideBySideLeftstatus'+id]) {
    window['removeSideBySideLeftstatus'+id]();
    window['removeSideBySideRightstatus'+id]();
  }
  if (window['removeSideBySideLeftheaders'+id]) {
    window['removeSideBySideLeftheaders'+id]();
    window['removeSideBySideRightheaders'+id]();
  }
  if (window['removeSideBySideLeftbody'+id]) {
    window['removeSideBySideLeftbody'+id]();
    window['removeSideBySideRightbody'+id]();
  }
}

function showComparison(comparison, responsePart, id) {
  var compareBtns = document.getElementById('compareBtns-'+ responsePart + '-' + id).children;
  var diff = document.getElementById('diff-' + responsePart + '-' + id);
  var sideBySide = document.getElementById('sideBySide-' + responsePart + '-' + id);
  var error = document.getElementById('error-' + responsePart + '-' + id);

  // call destroy and build functions
  switch (comparison) {
    case 'sideBySide':
      sideBySide.style.display = 'block';
      diff.style.display = 'none';
      if (error) {
        error.style.display = 'none';
      }
      compareBtns[0].classList.add('active');
      compareBtns[1].classList.remove('active');
      if (compareBtns[2]) {
        compareBtns[2].classList.remove('active');
      }
      break;
    case 'diff':
      diff.style.display = 'block';
      sideBySide.style.display = 'none';
      if (error) {
        error.style.display = 'none';
      }
      compareBtns[1].classList.add('active');
      compareBtns[0].classList.remove('active');
      if (compareBtns[2]) {
        compareBtns[2].classList.remove('active');
      }
      break;
    case 'error':
      error.style.display = 'block';
      diff.style.display = 'none';
      sideBySide.style.display = 'none';
      compareBtns[2].classList.add('active');
      compareBtns[1].classList.remove('active');
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

  // call destroy and build functions
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


$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip({
    placement : 'top'
  });
});

