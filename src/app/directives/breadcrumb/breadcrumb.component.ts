import { IBreadCrumb } from './../IBreadCrumb';
import { Component, OnInit } from "@angular/core";
import { Data, Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { filter, map } from "rxjs/operators";

@Component({
  selector: "app-breadcrumb",
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.scss"]
})
export class BreadcrumbComponent implements OnInit {
  public breadcrumbs: IBreadCrumb[];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.breadcrumbs = this._buildBreadcrumbs(this.activatedRoute.root);
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this._buildBreadcrumbs(this.activatedRoute.root);
      });
  }

  private _buildBreadcrumbs(
    activatedRoute: ActivatedRoute,
    url: string = ""
  ): IBreadCrumb[] {
    const children: ActivatedRoute[] = activatedRoute.children;

    if (children.length === 0) {
      return [];
    }

    let breadcrumbs: IBreadCrumb[] = [];

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map(segment => segment.path)
        .join("/");

      if (routeURL !== "") {
        url += `/${routeURL}`;
      }

      const routeData: Data = child.snapshot.data;

      if (routeData.breadcrumb) {
        breadcrumbs.push({ label: routeData.breadcrumb, url: url });
      } else if (routeData.apiData && routeData.apiData.breadcrumb) {
        breadcrumbs.push({
          label: routeData.apiData.breadcrumb,
          url: url
        });
      }

      breadcrumbs = breadcrumbs.concat(this._buildBreadcrumbs(child, url));
    }

    return breadcrumbs;
  }
}
