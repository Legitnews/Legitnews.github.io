#! /usr/bin/env python3

# LegitNews story updater
# Adds new stories as html files and links to them in the index

import easygui
import datetime

GOOGLE_ADS = """
<!-- Google Ads -->
<div style="background: black; float: bottom; position: fixed; bottom: 0;">
        <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <!-- Standard Ad Banner -->
        <ins class="adsbygoogle"
                 style="display:inline-block;width:970px;height:90px"
                 data-ad-client="ca-pub-6972452219567390"
                 data-ad-slot="1886876060"></ins>
        <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
</div>
"""

FONT = "verdana"
STORIESDIR = "Stories/"
INDEXDIR = "index.html"
STORIESCOMMENTS = ("<!-- Stories -->", "<!-- End Stories -->")

TIMEFORMAT = "%d/%m/%y"
DATE = datetime.datetime.now().strftime(TIMEFORMAT)

def wrapWithTag(string, tag, **kwargs):
    attributes = ""
    
    for kwarg in kwargs.items():
        attributes += kwarg[0] + ' = "' + kwarg[1] + '" '
    
    return "<" + tag + " " + attributes + ">" + string + "</" + tag + ">"

def inputStory():
    title = easygui.enterbox("Title of story:")
    url_title = "".join(char for char in title if char.isalnum()).lower()

    content = easygui.textbox().replace("\n", "<br>")
    content = wrapWithTag(title, "h1") + "\n\n" + wrapWithTag(DATE, "h3") + "\n<br><br>\n" + content

    return title, url_title, content

def splitTextAtPoints(text, points = STORIESCOMMENTS):
    indices = [0]
    
    for point in points:
        indices.append(text.index(point) + (len(point) * (points[0] == point)))

    indices.append(len(text))

    return [text[indices[i] : indices[i + 1]] for i in range(len(indices) - 1)]

def writeStory(title, url_title, content, file_extention = ".html"):
    filename = STORIESDIR + url_title + file_extention

    f = open(filename, "w")
    f.write(wrapWithTag(title, "title") + wrapWithTag(content, "font", face = FONT))
    f.close()

    indexf = open(INDEXDIR, "r")
    indexText = indexf.read()
    indexf.close()

    splitIndexText = splitTextAtPoints(indexText)

    splitIndexText[0] += "\n" + wrapWithTag(title, "a", href = filename) + "\n <br>"

    indexf = open(INDEXDIR, "w")
    indexf.write("".join(splitIndexText) + "\n\n" + GOOGLE_ADS)
    indexf.close()

def main():
    writeStory(*inputStory())

if __name__ == "__main__":
    main()
    
    
    


