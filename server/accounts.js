/*Accounts.onCreateUser(function (options, user) {
    var accessToken = user.services.google.accessToken,
        result, profile;

    result = Meteor.http.get("https://api.google.com/user", {
        params: {
            access_token: accessToken
        }
    });
    if (result.error)
        throw result.error

    profile = _.pick(result.data,
        "login",
        "name")

    user.profile = profile;

    return user;
});*/