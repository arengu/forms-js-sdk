# ArenguForms JavaScript SDK
Embed ours forms easily into your website with our JavaScript SDK.

## Getting started
On the first hand, paste this snippet into the `head` tag of your website:

```html
<script async src="https://sdk.arengu.com/forms.js"></script>
```

This snippet will load our JavaScript SDK into your website asynchronously, so it won’t affect your website load speed.

On the other hand, specify where you want to embed our form using any of the following strategies.

### **Method 1: Using a HTML tag** (Recommended)
Place the following HTML tag where you want your form to appear:

```html
<div data-arengu-form-id="YOUR_FORM_ID"></div>
```

You have to replace `YOUR_FORM_ID` with your **Form ID**, which you can find in your form settings or share page.

You can place **multiple HTML tags** on the same page, our SDK will detect all tags with `data-arengu-form-id` attribute and embed the forms inside them.

### **Method 2:** Calling our `embed` method

Our SDK has an embed method that allows to embed your form inside any element.

`embed` method definition:
```
ArenguForms.embed(formId, selector);
```
The `embed` call has the following fields:

| Parameter | Type | Description |
| ------ | ------ | ------ |
| formId _(required)_| [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | The **Form ID** of your form. You can find it in your form settings or share page. |
| selector _(required)_ | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)\|[Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) | Query selector or DOM  that the form will be appended to. |

Example using the query selector:

```javascript
ArenguForms.embed('5073697614331904', '.form-container');
```

That snippet will embed the form with ID `5073697614331904` into the element with `.form-container` class.

Another example using the element directly:

```javascript
const container = document.querySelector('.form-container'
ArenguForms.embed('5073697614331904', container);
```
In this case, the snippet gets a reference to the element and passes it directly to the `embed()` method.
