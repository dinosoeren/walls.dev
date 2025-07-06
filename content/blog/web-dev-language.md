+++
date = "2015-06-14T03:50:41-06:00"
draft = false
title = "What's the Most Important Language for Web Development?"
# original_title = "What is the Most Important Language to Learn for Web Development?"
tags = ["HTML/CSS", "JavaScript", "PHP", "Programming", "Web Design"]
categories = ["Blog", "Web"]
thumbnail = "images/web-dev-language/featured.jpg"
+++

My compatriots and friends often ask me, "**Soeren, what's the best programming language to learn?**"

This scenario is all too familiar to many of my fellow computer science geeks, I suspect. After all, we're programmers! Shouldn't we all know what the best language is? Many people simply do not realize that coding is not like Quidditch. There's no [Nimbus 2000](http://harrypotter.wikia.com/wiki/Nimbus_2000) of programming languages.

![Hermione says What an Idiot](http://media.giphy.com/media/13gE2P0Q9LGwBa/giphy.gif)

Rather, it's best to think of programming languages like tools in a toolset. You wouldn't ask a construction worker, "**Hey, what's the best tool in your belt?**", would you? She may have a favorite tool, or one that she likes to keep handy, but every tool has its own unique purpose. Similarly, there does not exist one single language that works the *best* out of them all; there are only languages that do *different* things.

That being said, perhaps a more appropriate question to ask might be: "**What's the most important programming language in the field of [x]?**" That's a much more interesting conversation to have, and it just so happens I may have found a small insight into a possible answer.

You see, I was browsing my Github repository, as one does in their spare time, and I made a connection I never noticed before. It's like when you walk past the same door every day; you stop thinking about it after the third or fourth time and eventually you just phase it out.

There's this handy feature on Github you may know about, which gives you a brief statistical overview of the languages used in your repository, like this:

![My github repository language statistics](../../images/web-dev-language/languages.png)

That's the private repository in which I keep the code for all the websites I've ever made, including this one. And if you didn't already notice, there's an interesting statistic lurking in there. Apparently, **42%** of the code that makes up all my websites is CSS. That's almost **half**!

![Ron Weasley says Wicked...](http://media.giphy.com/media/HFdZPf52z9x4s/giphy.gif)

Sorry, I'll stop with the Harry Potter gifs now.

But seriously, *what*?! If someone put a gun up to my head and told me I had 10 seconds to live unless I told them the #1 language I use as a web developer, I would have probably guessed Javascript or PHP, and then gotten shot! (I know, some of you would shoot me for just mentioning either of those languages. But they're really useful, okay? Get over it!)

![Hermione says Excuse me I have to go vomit](http://media.giphy.com/media/hOk0elg1CmHKw/giphy.gif)

I know, I said I'd stop. I'm really really done, I promise. They're just so fun!

It's possible that I'm just really weird, and that most other web devs don't use as much CSS, but I must say... If they don't, then they're dumb! CSS used to be just a tool for giving borders and colors to things, but ever since the release of CSS version 3, it has taken on entirely new role as possibly the most powerful (and most abused) language in the world of web design. You basically don't even need JavaScript anymore to build scalable, [cross-browser compatible](/post/7-easy-css-tricks-you-need-for-cross-browser-compatible-web-design/) web apps. Check out some of the neat things you can do with CSS3:

### [Animations](http://www.w3schools.com/css/css3_animations.asp) and [Transitions](http://www.w3schools.com/css/css3_transitions.asp).

   Yeah, for real. Practically any CSS property of any HTML element is animatable. They can even be infinitely looping.

### Generate content with [pseudo-classes](http://www.w3schools.com/css/css_pseudo_classes.asp)

   Some examples of pseudo-classes are `:after`, `:hover`, and `:invalid`. They allow you to conditionally alter properties of elements, usually when specific user-interactions occur. But even more impressively, you can actually put text into these elements using the CSS `content` property. Click that link to find out what I'm talking about.

### Calculate values with [`calc()`](https://developer.mozilla.org/en-US/docs/Web/CSS/calc)

   That's right. CSS isn't just a simple declarative language anymore. You can perform calculations! ... In some browsers :-(

### [3D Transformations](http://www.w3schools.com/css/css3_3dtransforms.asp)

   Yup. You can rotate, translate, and transform elements on all 3 axis. If you use this in an animation, you can create some [pretty spectacular visuals](https://desandro.github.io/3dtransforms/examples/cube-02-show-sides.html).

### [Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/calc) for different devices

   Ever heard of responsive or mobile-friendly design? This is how it's done. You can specify different properties for devices based on width, height, pixel density, device type, and more.

## Conclusion

Not impressed? You should be.

I'm not saying CSS is the godsend of all languages. There's plenty of stuff it still can't do. I mean, some people don't even consider it a language at all. (Technically it really isn't. It's more of a syntactical instruction sheet.) All I'm saying is that if 42% of a website's code is CSS, then for any beginners out there, it's probably a language worth focusing a lot of time on.

Do you disagree? Have anything to add about CSS and its all-powerful craziness? Wanna discuss these amazing Harry Potter gifs? Put it in the comments, yo.
