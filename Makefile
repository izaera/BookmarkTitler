FILES=background.js icon.svg manifest.json options.html options.js

BookmarkTitler.zip: $(FILES)
	zip -r -FS BookmarkTitler.zip $(FILES)

clean:
	rm -f BookmarkTitler.zip
