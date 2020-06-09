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

You can populate field or hidden field values to your form using URL parameters or `data-field-fieldId` attribute (where `fieldId` has to be replaced with its real identifier).

Example using URL parameters for `code` field:

```
https://www.acme.com/?code=ABC123
```

Example using custom attribute for `code` field:

```html
<div data-arengu-form-id="YOUR_FORM_ID" data-field-code="ABC123"></div>
```

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
| customValues _(optional)_ | [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | Object id-value pair to populate field or hidden field values. |

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

## Browser compatibility

Our SDK is built for two different targets: modern browsers and legacy ones. The CDN automatically delivers the right one in function of the `User-Agent` header specified in the request.

The following table specifies the minimum version supported by each target:

| Browser | Standard | Legacy |
| ------ | ------ | ------ |
| Google Chrome | >= 55 | >= 40
| Mozilla Firefox | >= 53 | >= 40
| Safari (Desktop) | >= 11 | >= 10
| Safari (iOS) | >= 11 | >= 10
| Microsoft Edge | >= 17 | >= 13
| Opera | >= 42 | >= 33
| Internet Explorer | None | >= 11
