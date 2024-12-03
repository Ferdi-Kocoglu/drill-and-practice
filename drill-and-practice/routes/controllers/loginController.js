import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";

// Renders login page
const showLoginForm = ({ render }) => {
    render("login.eta");
};

// Prorecesses login info.
const processLogin = async ({ request, response, state }) => {
    const body = request.body({ type: "form" });
    const params = await body.value;

    const userFromDatabase = await userService.findUserByEmail(
        params.get("email"),
    );
    if (userFromDatabase.length != 1) {
        console.log("User not found.");
        console.log(`User db length: ${userFromDatabase.length}`)
        response.redirect("/auth/login");
        return;
    }

    const user = userFromDatabase[0];
    const passwordMatches = await bcrypt.compare(
        params.get("password"),
        user.password,
    );


    if (!passwordMatches) {
        console.log("Password does not match");
        console.log(`Password input: ${params.get("password")}`);
        console.log(`Password in db: ${user.password}`);
        response.redirect("/auth/login");
        return;
    }

    await state.session.set("user", user);
    response.redirect("/topics");
};

// Logs user out.
const logout = async ({ response, state }) => {
    await state.session.set("authenticated", null);
    await state.session.set("user", null);

    response.redirect("/");
};

export { showLoginForm, processLogin, logout };
