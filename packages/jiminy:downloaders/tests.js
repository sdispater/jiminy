// Write your tests here!
// Here is an example.
var testsTitle = [
    ['Sonny.With.a.Chance.S02E15', 'Sonny.With.a.Chance', 2, 15]
]

Tinytest.add('Guesser guesses right', function (test) {
  var guesser = new Guesser();

  for (var i in testsTitle) {
    var tested = testsTitle[i];
    var guessed = guesser.guess(tested[0]);
    test.equal(tested[1], guessed.title);
  }
});
