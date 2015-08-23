# UberShit blog updater

import easygui
import datetime

BLOGDIR = "blog.html"
BLOGARCHIVEDIR = "blog.txt"
TIMEFORMAT = "%H:%M  %d/%m/%y"
STAMP = """<h2>Powered by UberShit blog updater<h2>
           <button type="button" onclick="window.location.href='blog updater.py'">UberShit blog updater source</button>
           <br>
        """

def wrapWithTag(string, tag):
    return "<" + tag + ">" + string + "</" + tag + ">"

def getPost():
    title = easygui.enterbox("Title", "UberShit blog updater")

    content = easygui.textbox("Content of blog post")

    return title, content

def formatPost(title, content):
    post = wrapWithTag(title, "h1")

    post += datetime.datetime.now().strftime(TIMEFORMAT)

    post += wrapWithTag(content, "p")

    return post.replace("\n", "<br>")

def writePost(post):
    try:
        blogfile = open(BLOGDIR)
        blogtext = blogfile.read()
        blogfile.close()
    except FileNotFoundError:
        blogtext = ""

    blogfile = open(BLOGDIR, "w")
    blogarchivefile = open(BLOGARCHIVEDIR, "w")

    text = STAMP + post + blogtext.replace(STAMP, "")
    
    blogfile.write(text)
    blogarchivefile.write(text)
    blogfile.close()
    blogarchivefile.close()

def main():
    writePost(formatPost(*getPost()))

if __name__ == "__main__":
    main()
