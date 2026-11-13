function babyGamePicture(shapes) {
	return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${shapes}</svg>`
}

export const BabyGamePictures = {
	sun: babyGamePicture("<g stroke=\"#d99a25\" stroke-width=\"6\" stroke-linecap=\"round\"><path d=\"M50 8v8m0 68v8M8 50h8m68 0h8M20 20l6 6m48 48 6 6M20 80l6-6m48-48 6-6\"/></g><circle cx=\"50\" cy=\"50\" r=\"25\" fill=\"#ffd56d\"/>"),
	tree: babyGamePicture("<path d=\"M44 64h12v29H44z\" fill=\"#855636\"/><path d=\"M50 5 22 43h13L13 75h74L65 43h13z\" fill=\"#43836a\"/>"),
	tent: babyGamePicture("<path d=\"M50 10 8 88h84z\" fill=\"#e5b46c\" stroke=\"#8e623c\" stroke-width=\"4\"/><path d=\"m50 36-16 52h32z\" fill=\"#72503a\"/><path d=\"m44 3 12 18m0-18L44 21\" stroke=\"#72503a\" stroke-width=\"4\"/>"),
	mountain: babyGamePicture("<path d=\"M3 88 40 17 79 88z\" fill=\"#778caa\"/><path d=\"m40 17-13 25 12-6 12 9z\" fill=\"#fff\"/><path d=\"m46 88 25-51 26 51z\" fill=\"#537b6c\"/>"),
	reindeer: "<img src=\"/apps/baby_game/hub/pics/reindeer.png\" alt=\"Reindeer\" />",
	fish: babyGamePicture("<path d=\"m70 50 24-24v48z\" fill=\"#df9d4e\"/><ellipse cx=\"42\" cy=\"50\" rx=\"33\" ry=\"23\" fill=\"#6aaabd\"/><path d=\"m33 29 15-14 12 18\" fill=\"#418699\"/><circle cx=\"24\" cy=\"45\" r=\"4\" fill=\"#244b52\"/><path d=\"M46 44v13\" stroke=\"#418699\" stroke-width=\"4\" stroke-linecap=\"round\"/>"),
	moon: babyGamePicture("<circle cx=\"50\" cy=\"50\" r=\"36\" fill=\"#ffda7d\"/><circle cx=\"65\" cy=\"35\" r=\"31\" fill=\"#555a91\"/>"),
	bear: babyGamePicture("<circle cx=\"23\" cy=\"23\" r=\"17\" fill=\"#8e6248\"/><circle cx=\"77\" cy=\"23\" r=\"17\" fill=\"#8e6248\"/><circle cx=\"50\" cy=\"54\" r=\"37\" fill=\"#a77c56\"/><ellipse cx=\"50\" cy=\"68\" rx=\"20\" ry=\"16\" fill=\"#e7cba3\"/><g fill=\"#30251e\"><circle cx=\"34\" cy=\"47\" r=\"4\"/><circle cx=\"66\" cy=\"47\" r=\"4\"/><ellipse cx=\"50\" cy=\"61\" rx=\"7\" ry=\"5\"/></g>"),
	flower: babyGamePicture("<path d=\"M50 48v46m0-16L31 68\" stroke=\"#468865\" stroke-width=\"7\"/><g fill=\"#e89a9a\"><circle cx=\"50\" cy=\"22\" r=\"16\"/><circle cx=\"31\" cy=\"39\" r=\"16\"/><circle cx=\"39\" cy=\"61\" r=\"16\"/><circle cx=\"62\" cy=\"60\" r=\"16\"/><circle cx=\"70\" cy=\"37\" r=\"16\"/></g><circle cx=\"50\" cy=\"42\" r=\"14\" fill=\"#ffda7d\"/>"),
	red: babyGamePicture("<circle cx=\"50\" cy=\"50\" r=\"36\" fill=\"#d85c54\"/>"),
	blue: babyGamePicture("<circle cx=\"50\" cy=\"50\" r=\"36\" fill=\"#447dd4\"/>"),
	yellow: babyGamePicture("<circle cx=\"50\" cy=\"50\" r=\"36\" fill=\"#f0c84d\"/>"),
	star: babyGamePicture("<path d=\"m50 6 13 28 31 4-23 22 6 32-27-15-28 15 6-32L5 38l32-4z\" fill=\"#e6b63e\"/>"),
	hat: babyGamePicture("<path d=\"M20 65V42a30 30 0 0 1 60 0v23\" fill=\"#698eb8\"/><path d=\"M12 62h76v18H12z\" rx=\"6\" fill=\"#3c658d\"/><circle cx=\"50\" cy=\"12\" r=\"10\" fill=\"#e9c676\"/>"),
	boots: babyGamePicture("<path d=\"M28 10h34v49l22 10v18H19V68l9-10z\" fill=\"#b0814e\" stroke=\"#755b41\" stroke-width=\"4\"/><path d=\"M30 18h29M19 84h65\" stroke=\"#edcf8d\" stroke-width=\"6\"/>"),
	mittens: babyGamePicture("<path d=\"M28 87V52L13 38a10 10 0 0 1 14-14l10 11V23a19 19 0 0 1 38 0v64z\" fill=\"#bd6e65\"/><path d=\"M26 77h51v16H26z\" fill=\"#f0d298\"/>"),
	fox: babyGamePicture("<path d=\"m11 48 2-40 28 20h18L87 8l2 40-39 44z\" fill=\"#d88b43\"/><path d=\"M11 48 50 72 89 48 50 92z\" fill=\"#fff4d7\"/><g fill=\"#3d3d37\"><circle cx=\"31\" cy=\"45\" r=\"4\"/><circle cx=\"69\" cy=\"45\" r=\"4\"/><ellipse cx=\"50\" cy=\"73\" rx=\"7\" ry=\"5\"/></g>"),
	sound: babyGamePicture("<path d=\"M12 38h21l26-22v68L33 62H12z\" fill=\"#397b68\"/><path d=\"M70 34q19 16 0 32m11-44q30 28 0 56\" fill=\"none\" stroke=\"#397b68\" stroke-width=\"6\" stroke-linecap=\"round\"/>"),
	yes: babyGamePicture("<path d=\"m18 51 22 22 43-47\" fill=\"none\" stroke=\"#397b68\" stroke-width=\"12\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>"),
	no: babyGamePicture("<path d=\"m24 24 52 52m0-52L24 76\" fill=\"none\" stroke=\"#bd6e65\" stroke-width=\"12\" stroke-linecap=\"round\"/>"),
	number: value => babyGamePicture(`<text x="50" y="76" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="76" fill="#397b68">${value}</text>`),
}
