# Arengu Forms JavaScript SDK
Embed our forms easily into your website with our JavaScript SDK.

## Getting started
To get started, paste this snippet into the `head` tag of your website:

```html
<script async src="https://sdk.arengu.com/forms.js"></script>
```

This snippet will load our JavaScript SDK into your website asynchronously, so it won’t affect your website load speed.

Specify where you want to embed our form using any of the following techniques.

### **Method 1: Using a HTML tag** (Recommended)
Place the following HTML tag where you want your form to appear:

```html
<div data-arengu-form-id="YOUR_FORM_ID"></div>
```

You have to replace `YOUR_FORM_ID` with your **Form ID**, which you can find in your form settings or share page.

You can place **multiple HTML tags** on the same page, our SDK will detect all tags with `data-arengu-form-id` attribute and embed the forms inside them.

You can populate field or hidden field values to your form using URL parameters or `data-arengu-fieldId` attribute.

Example using URL parameters:

https://www.acme.com/?fieldId=foobar

Example using custom attribute:

<div data-arengu-form-id="YOUR_FORM_ID" data-arengu-fieldId="foobar"></div>

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
| selector _(required)_ | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)\|[Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) | Query selector or DOM element that the form will be appended to. |
| customValues _(optional)_ | [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)) | Object id-value pair to populate field or hidden field values. |

Example using the query selector:

```javascript
ArenguForms.embed('5073697614331904', '.form-container');
```

Example using the query selector and populated values:

```javascript
ArenguForms.embed('5073697614331904', '.form-container', {
  userId: '123456',
  email: 'jane.doe@arengu.com'
});
```

That snippet will embed the form with ID `5073697614331904` into the element with `.form-container` class.

Another example using the element directly:

```javascript
const container = document.querySelector('.form-container');
ArenguForms.embed('5073697614331904', container);
```
In this case, the snippet gets a reference to the element and passes it directly to the `embed()` method.
