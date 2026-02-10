# How to Add Your UPI QR Code

To enable UPI payments, you need to add your own UPI QR code to the payment modal.

## Step 1: Generate Your UPI QR Code

1. **Open your UPI app** (GPay, PhonePe, or Paytm)
2. **Go to "Receive Money"** or "QR Code"
3. **Enter amount**: ₹199
4. **Generate QR code**
5. **Save the QR code image** to your phone/computer

## Step 2: Add QR Code to Your Project

1. **Save the QR image** in your project:
   ```
   frontend/upi-qr-code.png
   ```

2. **Open** `frontend/index.html`

3. **Find this section** (around line 167):
   ```html
   <!-- UPI QR Code Placeholder -->
   <div class="bg-white p-6 rounded-lg mb-4 text-center">
       <div class="w-64 h-64 mx-auto bg-gray-100 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-600">
           <div class="text-center">
               <p class="font-semibold mb-2">Your UPI QR Code</p>
               ...
           </div>
       </div>
   </div>
   ```

4. **Replace with**:
   ```html
   <!-- UPI QR Code -->
   <div class="bg-white p-6 rounded-lg mb-4 text-center">
       <img 
           src="upi-qr-code.png" 
           alt="UPI QR Code - Pay ₹199"
           class="w-64 h-64 mx-auto"
       >
   </div>
   ```

## Step 3: Update Your UPI ID

1. **Find this line** (around line 183):
   ```html
   <code id="upi-id" class="text-green-400 text-lg font-mono">yourname@okicici</code>
   ```

2. **Replace** `yourname@okicici` with your actual UPI ID (e.g., `9876543210@paytm`)

## Step 4: Update Contact Email

1. **Find** (around line  250):
   ```html
   <li>• Contact: <span class="text-green-400">your@email.com</span> for issues</li>
   ```

2. **Replace** `your@email.com` with your actual email

## Done!

Now when users click "Fix My Resume (₹199)":
1. They'll see your actual UPI QR code
2. They can scan and pay ₹199
3. They enter the transaction ID
4. You verify and send the fixed resume!

---

## Alternative: Use UPI Deep Link

Instead of QR code, you can use a UPI payment link:

```html
<a 
    href="upi://pay?pa=yourname@okicici&pn=YourName&am=199&cu=INR&tn=Resume%20Fix"
    class="bg-green-600 text-white px-6 py-3 rounded-lg">
    Pay ₹199 via UPI App
</a>
```

This opens the user's UPI app directly!
