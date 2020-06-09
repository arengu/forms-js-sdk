# Arengu Forms JavaScript SDK
Embed our forms easily into your website with our JavaScript SDK.

## Table of Contents
  - [Getting started](#getting-started)
  - [Embed options](#embed-options)
    - [Method 1: Using a HTML tag (Recommended)](#method-1-using-a-html-tag-recommended)
    - [Method 2: Calling our `embed` method](#method-2-calling-our-embed-method)
  - [Custom DOM events](#custom-dom-events)
    - [List of custom DOM events:](#list-of-custom-dom-events)
    - [List of available properties of the event object:](#list-of-available-properties-of-the-event-object)
  - [Browser compatibility](#browser-compatibility)

## Getting started
To get started, paste this snippet into the `head` tag of your website:

```html
<script async src="https://sdk.arengu.com/forms.js"></script>
```

This snippet will load our JavaScript SDK into your website asynchronously, so it won’t affect your website load speed.

## Embed options

Specify where you want to embed our form using any of the following techniques.

### Method 1: Using a HTML tag (Recommended)
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

### Method 2: Calling our `embed` method

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

## Custom DOM events

Our SDK provides several types of custom DOM events. You can utilize the events within your JavaScript code to run a function in a specific situation. These events are particularly useful for analytics purposes.

### List of custom DOM events:

| Event | Description |
| ------ | ------ |
| `af-init` | Fires when the SDK initializes successfully.|
| `af-getForm` | Fires when requesting a form.|
| `af-getForm-success` | Fires when successfully getting a form.|
| `af-getForm-error` | Fires when there is an error trying to get a form.|
| `af-embedForm` | Fires when starting to embed a form.|
| `af-embedForm-error` | Fires when there is an error embedding a form.|
| `af-embedForm-success` | Fires when a form is successfully embed.|
| `af-previousStep` | Fires when going to the previous form step.|
| `af-nextStep` | Fires when continuing to the next form step.|
| `af-submitForm` | Fires when a form is submitted, regardless of the result.|
| `af-submitForm-error` | Fires when there is an error submitting a form.|
| `af-submitForm-success` | Fires when a form is submitted successfully.|
| `af-invalidFields-error` | Fires when there are invalid fields. |
| `af-blurField` | Fires when a field loses focus |
| `af-focusField` | Fires when a field gets focus |
| `af-changeField` | Fires when the value of a field has been changed. |

Example listening an event and printing a message:

```javascript
document.addEventListener('af-submitForm-success', function() {
  analytics.track('formSubmit');
});
```

All these events pass data to the event handler as `detail` property.

### List of available properties of the event object:

| Property | Description |
| ------ | ------ |
| `detail.formId` | The ID of the form. |
| `detail.confirmation.id` | Confirmation of the submission. |
| `detail.fielId` | The ID of the field. |
| `detail.value` | The value of the field. |
| `detail.current` | The ID of the current step. |
| `detail.next` | The ID of the next step. |
| `detail.previous` | The ID of the previous  step |
| `detail.formData` | The submitted form fields data. |
| `detail.metaData` | The submitted form meta data. |

Example listening an event and using `detail` property to send analytics data:

```javascript
document.addEventListener('af-submitForm-success', function(e) {
  analytics.track('formSubmit', {
    formId: e.detail.formId
  });
});
```

## Browser compatibility

Our SDK is built for two different targets: modern browsers and legacy ones. The CDN automatically delivers the right one in function of the `User-Agent` header specified in the request.

The following table specifies the minimum version supported by each target:

| Browser | Standard | Legacy |
| ------ | ------ | ------ |
| Google Chrome | >= 55 (Dec 2016) | >= 40 (Jan 2015)
| Mozilla Firefox | >= 53 (Apr 2017) | >= 40 (Aug 2015)
| Safari (Desktop) | >= 11 (Sept 2017) | >= 10 (Sept 2016)
| Safari (iOS) | >= 11 (Sept 2017) | >= 10 (Sept 2016)
| Microsoft Edge (EdgeHTML) | >= 17 (Apr 2018) | >= 13 (Sept 2015)
| Opera | >= 42 (Dec 2016) | >= 33 (Oct 2015)
| Internet Explorer | None | >= 11 (Oct 2013)
