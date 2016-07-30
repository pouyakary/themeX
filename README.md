
<img src="https://cloud.githubusercontent.com/assets/2157285/17261214/d2ee31f4-55e9-11e6-9e8e-4980ffe43c68.png" width="100" />

**The Universal Color Scheme Generator**

## What is this?

<center>
<img src="https://cloud.githubusercontent.com/assets/2157285/17270465/510d7ef8-5678-11e6-8337-57d4292e5916.jpg" width="600" />
</center>

When you're writing a color scheme you end up having some concerns:
- There are many editors to support. Fortunately Visual Studio Code, Sublime Text and TextMate have a shared format `tmTheme` that is also supported by Atom through a convertor. However it still remains support for major tools like Visual Studio, Xcode, Xamarin Studio, IDEs by Jetbrains, LightTable, Qt Creator and many many many other...

- You have to develop bot for Light and Dark. The problem is you always have a color theme and you specify what color for what scope. Now the only different between light and dark is the tone of those colors. Why cant you just create a color tone for dark and light and then let the software generate themes based on shared scope definitions?

- Colors defined by you are not displayed in the result correctly. After having an [interesting issue](https://github.com/Microsoft/vscode/issues/9629) with Visual Studio Code and Sublime Text, we found out that the editors tend to change your colors. We had to have a way to bypass their color filters by changing the colors of your scheme in the result files so after they apply their color changes, your colors remain the same.

Now what themeX is? It's pretty much what we told you. You define your theme once, using it's adaptors; themeX generates themes for many of the supported editors, You also define both dark and light versions of your theme at one place and themeX takes care of the rest and also it makes sure your colors are being rendered just right in the runtime.

## How to have it?
```
npm install -g themex
```
Create a folder for your file theme. and then use:
```
themex init
```
To make the folder into a themeX project.

<br/>
<a href="http://www.karyfoundation.org/">
    <img src="http://www.karyfoundation.org/foundation/logo/github-full-horse.png" width="250"/>
</a>