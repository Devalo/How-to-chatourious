defmodule Chatourius.PageController do
  use Chatourius.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
