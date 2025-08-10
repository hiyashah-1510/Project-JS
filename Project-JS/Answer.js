console.log("1.Fitness System")
console.log("2.Monthly Budget Planner")
console.log("3.Mobile Data usage system")
console.log("4.Password System")

let choice = parseInt(prompt("Enter your choice:"));

if(choice == 1){
    let age = parseInt(prompt("Enter your age:"));
    let weight = parseFloat(prompt("Enter your weight:"));

    let min = 0, max = 0;

    if (age >= 5 && age <= 12){ 
        min = 20; max = 40;
    }

    if (age >= 13 && age <= 19) { 
        min = 45; max = 65; 
    }

    if (age >= 20 && age <= 40) { 
        min = 50; max = 80; 
    }
    if (age > 40) { 
        min = 55; max = 75; 
    }
    if (age < 5) {
        console.log("Age range not supported.");
    } 
    else {
        if (weight >= min && weight <= max){
            console.log("You are fit for your age.");
        }
        if (weight < min){
            console.log("You are underweight for your age. Consider a healthy diet.");
        }
        if (weight > max){
            console.log("You are overweight for your age. Consider regular exercise.");
        }
    }

}
else if(choice == 2){

    let income = parseFloat(prompt("Enter your monthly income:"));

    if (income < 10000) {
        console.log("Spend cautiously and save more!");
    } 
    else if (income >= 10000 && income < 30000) {
        console.log("Balanced budget!");
    } 
    else if (income >= 30000) {
        console.log("Your income is great! Consider investing in SIPs.");
    }

}
else if(choice == 3){
    let data = parseFloat(prompt("Enter total data used in a month (in GB):"));

    if (data < 5) {
        console.log("Low usage");
    } 
    else if (data >= 5 && data < 15) {
        console.log("Normal usage");
    } 
    else if (data >= 15) {
        console.log("You are a heavy data user. Upgrade your plan.");
    }
}
else if(choice == 4){
    let oldPassword = "rnw@123";

    let enteredOld = prompt("Enter old password:");
    let newPassword = prompt("Enter new password:");
    let confirmPassword = prompt("Confirm new password:");

    if (enteredOld === oldPassword) {
        if (newPassword === confirmPassword) {
            console.log("Password changed successfully.");
        } else {
            console.log("Passwords do not match.");
        }
    } else {
        console.log("Old password is incorrect.");
    }
}
else{
    console.log("Invalid choice..!")
}