let choice;
let bill = 0;
let password = "1234";
let totalItems = 0;
let highest = 0;
let lowest = 999;
let sum = 0;

do {
    console.log(`----------Cafe Menu----------
        1. Place Order
        2. View Bill
        3. Apply Discount
        4. Change Cafe Password
        5. View Café Report
        0. Exit`);

    choice = parseInt(prompt("Enter your choice : "));

    if (choice == 1) {
        console.log("You choose to place an order..!");
        document.write("<h3>You choose to place an order..!</h3>");

        let order;
        do {
            console.log(`
                1. Coffee ($50)
                2. Tea ($30)
                3. Sandwich ($80)
                4. Pastry ($100)
                0. exit
            `);
            document.write("1. Coffee ($50)<br>2. Tea ($30)<br>3. Sandwich ($80)<br>4. Pastry ($100)<br>0.Exit<br>");

            order = parseInt(prompt("Enter item number: "));
            let price = 0;

            if (order == 1) {
                price = 50;
            }
            else if (order == 2) {
                price = 30;
            }
            else if (order == 3) {
                price = 80;
            }
            else if (order == 4) {
                price = 100;
            }
            else if (order == 0) {
                console.log("Return to main menu..!");
            }
            else {
                console.log("Invalid item number!");
                document.write("Invalid item number!<br>");
            }

            if (price > 0) {
                bill += price;
                totalItems++;
                sum += price;

                if (price > highest) highest = price;
                if (price < lowest) lowest = price;

                console.log("Item added! Current bill: $" + bill);
                document.write("Item added! Current bill: $" + bill + "<br>");
            }
        } while (order != 0);
    }

    else if (choice == 2) {
        console.log("You choose to view your bill..!");
        document.write("<h3>You choose to view your bill..!</h3>");

        if (sum > 0) {
            let subtotal = sum;
            let gst = subtotal * 0.05;
            let grandTotal = subtotal + gst;

            console.log("Subtotal: $" + subtotal);
            console.log("GST (5%): $" + gst);
            console.log("Grand Total: $" + grandTotal);

            document.write("Subtotal: $" + subtotal + "<br>");
            document.write("GST (5%): $" + gst + "<br>");
            document.write("Grand Total: $" + grandTotal + "<br>");
        } else {
            console.log("No items ordered yet!");
            document.write("No items ordered yet!<br>");
        }
    }

    else if (choice == 3) {
        if (bill > 0) {
        let discount = 0;
            if (bill > 1000) {
                discount = 0.20;
            } 
            else if (bill > 500) {
                discount = 0.10;
            }
             else {
                discount = 0;
            }

            let discountAmount = bill * discount;
            let finalBill = bill - discountAmount;

            console.log("Original: ₹" + bill);
            console.log("Discount: ₹" + discountAmount);
            console.log("Final: ₹" + finalBill);
            bill = finalBill;
        } else {
            console.log("No items ordered yet!");
        }
    }

    else if (choice == 4) {
        var Oldpassword = prompt("Enter Your Old password :");
        let Newpassword = prompt("Enter Your New password :");
        let Confirmpassword = prompt("Enter Confirm password :");

        if (password === Oldpassword) {
            if (Newpassword === Confirmpassword) {
                if (Newpassword != password) {
                    if (Newpassword.length >= 4) {
                        if (/[A-Z]/.test(Newpassword) && /[!@#$%^&*(),.?":{}|<>]/.test(Newpassword) && /[0-9]/.test(Newpassword)) {
                            password = Newpassword;
                            console.log("Your New Password has been set sucessfully!!<br>");
                            document.write("Your New Password has been set sucessfully!!")
                            console.log(`Your new password is : ${password}`);
                            document.write(`Your new password is : ${password}<br>`)
                        }
                        else {
                            console.log("New Password must contain one character Capital and one special character and one digit...");
                            document.write("New Password must contain one character Capital and one special character and one digit...<br>");
                        }
                    }
                    else {
                        console.log("New Password must contain 4 characters or more..!");
                        document.write("New Password must contain 4 characters or more..!<br>")
                    }
                }
                else {
                    console.log("Newpassword and Old password must be different..!");
                    document.write("Newpassword and Old password must be different..!<br>")
                }
            }
            else {
                console.log("Newpassword and Confirm password must be same..!");
                document.write("Newpassword and Confirm password must be same..!<br>")
            }
        }
        else {
            console.log("Your Old password is not matched..!");
            document.write("Your Old password is not matched..!<br>")
        }
    }

    else if (choice == 5) {
        console.log("You choose to view cafe Report..!");
        document.write("<h3>You choose to view cafe Report..!</h3>");

        if (totalItems > 0) {
            let average = sum / totalItems;

            console.log("Total Items Sold: " + totalItems);
            console.log("Highest Price Item: $" + highest);
            console.log("Lowest Price Item: $" + lowest);
            console.log("Average Price: $" + average);

            document.write("Total Items Sold: " + totalItems + "<br>");
            document.write("Highest Price Item: $" + highest + "<br>");
            document.write("Lowest Price Item: $" + lowest + "<br>");
            document.write("Average Price: $" + average + "<br>");
        }
        else {
            console.log("No items sold yet!");
            document.write("No items sold yet!<br>");
        }
    }

    else if (choice == 0) {
        console.log("Thank You visit again..!");
        document.write("<h3>Thank You visit again..!</h3>");
    }

    else {
        console.log("Invalid choice..!");
        document.write("Invalid choice..!<br>");
    }

} while (choice != 0);