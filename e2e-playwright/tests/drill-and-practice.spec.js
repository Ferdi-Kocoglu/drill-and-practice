const { test, expect } = require("@playwright/test");

test("Main page has title 'Drill and Practice'. This test might not pass on first try.", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Drill and Practice");
});

test("Main page has h2 element 'Statistics'", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole('heading', { name: 'Statistics' })).toHaveText("Statistics");
});

test("Main page shows statistics.", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("td >> text='Topics created'")).toHaveText("Topics created");
    await expect(page.locator("td >> text='Questions created'")).toHaveText("Questions created");
    await expect(page.locator("td >> text='Questions answered'")).toHaveText("Questions answered");
})

test("Can create a user with registaration page.", async ({ page }) => {
    await page.goto("/auth/register");
    await expect(page.locator("h1")).toHaveText("Registration form");
    await page.locator("input[type=email]").type("testerEmail@test.com");
    await page.locator("input[type=password]").type("12345");
    await page.locator("input[type=submit]>> text='Register'").click();
    await expect(page.locator("h1")).toHaveText("Login form");
});

test("Can login to newly created user.", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.locator("h1")).toHaveText("Login form");
    await page.locator("input[type=email]").type("testerEmail@test.com");
    await page.locator("input[type=password]").type("12345");
    await page.locator("input[type=submit]>> text='Login'").click();
    await expect(page.locator("h1")).toHaveText("Topics");
});

test("Default topic 'Finnish language' exists on topic page", async ({ page }) => {
    /**
     * If this test fails please input following commands:
     * docker-compose down
     * docker-compose up
     * 
     * Then stop docker with CRTL + C shortcut
     * Then start test again.
     */
    await page.goto("/auth/login");
    await expect(page.locator("h1")).toHaveText("Login form");
    await page.locator("input[type=email]").type("testerEmail@test.com");
    await page.locator("input[type=password]").type("12345");
    await page.locator("input[type=submit]>> text='Login'").click();
    await expect(page.locator("h1")).toHaveText("Topics");
    await expect(page.locator("li >> text ='Finnish language'")).toHaveText("Finnish language");
});


test("Clicking topic name opens topic page with functionality to add questions", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.locator("h1")).toHaveText("Login form");
    await page.locator("input[type=email]").type("testerEmail@test.com");
    await page.locator("input[type=password]").type("12345");
    await page.locator("input[type=submit]>> text='Login'").click();
    await expect(page.locator("h1")).toHaveText("Topics");
    await expect(page.locator("li >> text ='Finnish language'")).toHaveText("Finnish language");
    await page.locator("li >> text ='Finnish language'").click();
    await expect(page.locator("h1")).toHaveText("Finnish language");
    await expect(page.locator("h2 >> text ='Add a question!'")).toHaveText("Add a question!");
    await expect(page.locator("h2 >> text ='Questions:'")).toHaveText("Questions:");
    await expect(page.locator("p >> text ='No questions available.'")).toHaveText("No questions available.");
    await page.locator("input[type=text]").type("Testing question! Answer is Yes.");
    await page.locator("input[type=submit]>> text='Add'").click();
    await expect(page.locator("h1")).toHaveText("Finnish language");
    await expect(page.locator("h2 >> text ='Questions:'")).toHaveText("Questions:");
    await expect(page.locator("li >> text ='Testing question! Answer is Yes.'")).toHaveText("Testing question! Answer is Yes.");
});

test("Clicking question opens question page with functionality to add answer options", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.locator("h1")).toHaveText("Login form");
    await page.locator("input[type=email]").type("testerEmail@test.com");
    await page.locator("input[type=password]").type("12345");
    await page.locator("input[type=submit]>> text='Login'").click();
    await expect(page.locator("h1")).toHaveText("Topics");
    await expect(page.locator("li >> text ='Finnish language'")).toHaveText("Finnish language");
    await page.locator("li >> text ='Finnish language'").click();
    await expect(page.locator("h1")).toHaveText("Finnish language");
    await expect(page.locator("h2 >> text ='Add a question!'")).toHaveText("Add a question!");
    await expect(page.locator("h2 >> text ='Questions:'")).toHaveText("Questions:");
    await expect(page.locator("li >> text ='Testing question! Answer is Yes.'")).toHaveText("Testing question! Answer is Yes.");
    await page.locator("li >> text ='Testing question! Answer is Yes.'").click();
    await expect(page.locator("h1")).toHaveText("Testing question! Answer is Yes.");
    await expect(page.locator("h2 >> text ='Options'")).toHaveText("Options");
    await expect(page.locator("h2 >> text ='Add new answer option'")).toHaveText("Add new answer option");
    await expect(page.locator("li")).toHaveCount(4);
    await page.locator("input[type=text]").type("What");
    await page.locator("input[type=submit]>> text='Add'").click();
    await expect(page.locator("li")).toHaveCount(5);
    await page.locator("input[type=text]").type("No");
    await page.locator("input[type=submit]>> text='Add'").click();
    await expect(page.locator("li")).toHaveCount(6);
    await page.locator("input[type=text]").type("Yes");
    await page.getByRole('checkbox').check();
    await page.locator("input[type=submit]>> text='Add'").click();
    await expect(page.locator("li")).toHaveCount(7);
});

test("Can login to admin account", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.locator("h1")).toHaveText("Login form");
    await page.locator("input[type=email]").type("admin@admin.com");
    await page.locator("input[type=password]").type("123456");
    await page.locator("input[type=submit]>> text='Login'").click();
    await expect(page.locator("h1")).toHaveText("Topics");
});

test("Admin can delete a topic.", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.locator("h1")).toHaveText("Login form");
    await page.locator("input[type=email]").type("admin@admin.com");
    await page.locator("input[type=password]").type("123456");
    await page.locator("input[type=submit]>> text='Login'").click();
    await expect(page.locator("h1")).toHaveText("Topics");
    await page.locator("input[type=submit]>> text='Delete'").click();
    await expect(page.locator("h1")).toHaveText("Topics");
    await expect(page.locator("p >> text='No topics available.'")).toHaveText("No topics available.");
});

test("Admin can add a topic.", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.locator("h1")).toHaveText("Login form");
    await page.locator("input[type=email]").type("admin@admin.com");
    await page.locator("input[type=password]").type("123456");
    await page.locator("input[type=submit]>> text='Login'").click();
    await expect(page.locator("h1")).toHaveText("Topics");
    await expect(page.locator("h2 >> text='Add new topic'")).toHaveText("Add new topic");
    await page.locator("input[type=text]").type("Math");
    await page.locator("input[type=submit]>> text='Add'").click();
    await expect(page.locator("li >> text ='Math'")).toHaveText("Math");
});

test("Adding new questions and options to newly created topic", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.locator("h1")).toHaveText("Login form");
    await page.locator("input[type=email]").type("admin@admin.com");
    await page.locator("input[type=password]").type("123456");
    await page.locator("input[type=submit]>> text='Login'").click();
    await expect(page.locator("h1")).toHaveText("Topics");
    await expect(page.locator("li >> text ='Math'")).toHaveText("Math");
    await page.locator("li >> text ='Math'").click();
    await expect(page.locator("h1")).toHaveText("Math");
    await expect(page.locator("h2 >> text ='Add a question!'")).toHaveText("Add a question!");
    await expect(page.locator("h2 >> text ='Questions:'")).toHaveText("Questions:");
    await expect(page.locator("p >> text ='No questions available.'")).toHaveText("No questions available.");
    await page.locator("input[type=text]").type("Testing question! Answer is Yes.");
    await page.locator("input[type=submit]>> text='Add'").click();
    await expect(page.locator("h1")).toHaveText("Math");
    await expect(page.locator("h2 >> text ='Questions:'")).toHaveText("Questions:");
    await expect(page.locator("li >> text ='Testing question! Answer is Yes.'")).toHaveText("Testing question! Answer is Yes.");
    await page.locator("li >> text ='Testing question! Answer is Yes.'").click();
    await expect(page.locator("h1")).toHaveText("Testing question! Answer is Yes.");
    await expect(page.locator("h2 >> text ='Options'")).toHaveText("Options");
    await expect(page.locator("h2 >> text ='Add new answer option'")).toHaveText("Add new answer option");
    await expect(page.locator("li")).toHaveCount(4);
    await page.locator("input[type=text]").type("What");
    await page.locator("input[type=submit]>> text='Add'").click();
    await expect(page.locator("li")).toHaveCount(5);
    await page.locator("input[type=text]").type("No");
    await page.locator("input[type=submit]>> text='Add'").click();
    await expect(page.locator("li")).toHaveCount(6);
    await page.locator("input[type=text]").type("Yes");
    await page.getByRole('checkbox').check();
    await page.locator("input[type=submit]>> text='Add'").click();
    await expect(page.locator("li")).toHaveCount(7);
    await page.getByRole('link', { name: 'Back to topic' }).click();
    await expect(page.locator("h1")).toHaveText("Math");
    await page.locator("input[type=text]").type("Testing question 2! Answer is No.");
    await page.locator("input[type=submit]>> text='Add'").click();
    await page.locator("li >> text ='Testing question 2! Answer is No.'").click();
    await expect(page.locator("h1")).toHaveText("Testing question 2! Answer is No.");
    await expect(page.locator("h2 >> text ='Options'")).toHaveText("Options");
    await expect(page.locator("h2 >> text ='Add new answer option'")).toHaveText("Add new answer option");
    await expect(page.locator("li")).toHaveCount(4);
    await page.locator("input[type=text]").type("What");
    await page.locator("input[type=submit]>> text='Add'").click();
    await expect(page.locator("li")).toHaveCount(5);
    await page.locator("input[type=text]").type("Yes");
    await page.locator("input[type=submit]>> text='Add'").click();
    await expect(page.locator("li")).toHaveCount(6);
    await page.locator("input[type=text]").type("No");
    await page.getByRole('checkbox').check();
    await page.locator("input[type=submit]>> text='Add'").click();
    await expect(page.locator("li")).toHaveCount(7);
});

test("Quiz topics page can be accessed and has created topic listed", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.locator("h1")).toHaveText("Login form");
    await page.locator("input[type=email]").type("admin@admin.com");
    await page.locator("input[type=password]").type("123456");
    await page.locator("input[type=submit]>> text='Login'").click();
    await expect(page.locator("h1")).toHaveText("Topics");
    await page.getByRole('link', { name: 'Quiz' }).click();
    await expect(page.locator("h1")).toHaveText("Quiz topics");
    await expect(page.locator("li >> text ='Math'")).toHaveText("Math");
});