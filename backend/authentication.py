from datetime import datetime
import os
from fastapi import APIRouter, status, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi import Request, Response
from requests_oauthlib import OAuth2Session
import jwt

router = APIRouter()

GITHUB_CLIENT_ID = "d3c3ab15799b9e9da842"
GITHUB_CLIENT_SECRET = "f4f2894ef46c48248a3f1f9f82f06141d54a2a1f"

SECRET_KEY = "zzahgqtjfo"

# OAuth endpoints given in the GitHub API documentation
authorization_base_url = "https://github.com/login/oauth/authorize"
token_url = "https://github.com/login/oauth/access_token"
user_data_url = "https://api.github.com/user"


@router.get("/logout", status_code=status.HTTP_200_OK)
def logout(request: Request):
    request.session.pop("role")
    return "You Logged Out"


@router.get("/redirect", response_class=RedirectResponse)
async def login(request: Request):
    """
    Redirect user to GitHub for authentication.
    Future: Implement button that user clicks to cause the redirection.
    """

    github = OAuth2Session(
        GITHUB_CLIENT_ID,
        scope=["read:org", "read:user", "user:email"],
        redirect_uri="http://localhost:8001/callback",
    )

    # Redirect user to GitHub for authorization
    authorization_url, state = github.authorization_url(authorization_base_url)
    request.session["oauth_state"] = state
    return authorization_url


@router.get("/callback", response_class=RedirectResponse)
async def callback(request: Request, response: Response):
    """
    Fetch token of user and redirect to subdirectory /organizations.
    """
    github = OAuth2Session(GITHUB_CLIENT_ID, state=request.session["oauth_state"])

    # Convert authorization_reponse url to return with https
    authorization_response = str(request.url)[:4] + "s" + str(request.url)[4:]
    github_token = github.fetch_token(
        token_url,
        client_secret=GITHUB_CLIENT_SECRET,
        authorization_response=authorization_response,
    )
    github_user_data = github.get(user_data_url).json()
    name = github_user_data["name"]
    login = github_user_data["login"]
    payload = {"name": name, "login": login}
    encoded = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    response.set_cookie(key="token", value=encoded)
    return "http://localhost:3000/todos"


def verify_token(token):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded
    except:
        raise HTTPException(status_code=403, detail="Forbidden")
